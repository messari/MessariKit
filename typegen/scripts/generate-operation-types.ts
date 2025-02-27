/**
 * ⚠️ WARNING: DO NOT RUN THIS SCRIPT DIRECTLY ⚠️
 *
 * This script is part of the type generation process and should only be run
 * through the package.json scripts from the root directory:
 *
 * - pnpm api:build - Runs the complete build process
 * - pnpm api:types - Generates TypeScript types
 *
 * Running this script directly may result in incomplete type generation,
 * missing pagination parameters, or other issues with the generated types.
 *
 * See the README.md in the typegen directory for more information.
 */

import fs from "node:fs";
import path from "node:path";
import type { OpenAPIV3 } from "openapi-types";
import yaml from "js-yaml";

// Define a type that extends OpenAPIV3.Document to include our custom components
interface OpenAPISpec extends OpenAPIV3.Document {
  components?: OpenAPIV3.ComponentsObject;
}

/**
 * Generates a path function for an operation
 */
function generatePathFunction(pathTemplate: string, hasParams: boolean): string {
  if (!hasParams) {
    return `() => '${pathTemplate}'`;
  }
  return `(p: PathParams) => \`${pathTemplate.replace(/{([^}]+)}/g, "${p.$1}")}\``;
}

/**
 * Gets properties from a schema
 */
function getSchemaProperties(schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject | undefined, spec: OpenAPISpec): string[] {
  if (!schema) return [];

  if ("$ref" in schema) {
    const refPath = schema.$ref.split("/");
    const schemaName = refPath[refPath.length - 1];
    const refSchema = spec.components?.schemas?.[schemaName] as OpenAPIV3.SchemaObject;
    return refSchema?.properties ? Object.keys(refSchema.properties) : [];
  }

  return schema.properties ? Object.keys(schema.properties) : [];
}

/**
 * Extracts parameter names from an operation
 */
function extractParameterNames(operation: OpenAPIV3.OperationObject, spec: OpenAPISpec): { queryParams: string[]; pathParams: string[]; bodyParams: string[] } {
  // Process parameters directly defined in the operation
  const processParams = (params: (OpenAPIV3.ParameterObject | OpenAPIV3.ReferenceObject)[] | undefined) => {
    if (!params) return { queryParams: [] as string[], pathParams: [] as string[] };

    const queryParams: string[] = [];
    const pathParams: string[] = [];

    for (const p of params) {
      // Handle parameter references
      if ("$ref" in p) {
        // For parameters like '#/components/parameters/page', we want to extract 'page'
        const refParts = p.$ref.split("/");
        const paramName = refParts[refParts.length - 1];

        // Skip API key parameter
        if (paramName === "apiKey" || paramName === "x-messari-api-key") {
          continue;
        }

        // Common pagination parameters
        if (paramName === "page" || paramName === "limit") {
          queryParams.push(paramName);
        }
        // Path parameters typically have 'path' in their name
        else if (paramName.includes("path") || paramName.includes("Path")) {
          pathParams.push(paramName);
        }
        // Default to query parameter for other cases
        else {
          queryParams.push(paramName);
        }
      } else {
        // Handle directly defined parameters
        if (p.in === "query" && p.name !== "x-messari-api-key") {
          queryParams.push(p.name);
        } else if (p.in === "path") {
          pathParams.push(p.name);
        }
      }
    }

    return { queryParams, pathParams };
  };

  const result = processParams(operation.parameters);
  const queryParams = result?.queryParams || [];
  const pathParams = result?.pathParams || [];

  // Extract body parameters from request body
  const bodySchema = operation.requestBody && "content" in operation.requestBody ? operation.requestBody.content?.["application/json"]?.schema : undefined;

  const bodyParams = getSchemaProperties(bodySchema, spec);

  return { queryParams, pathParams, bodyParams };
}

/**
 * Generates TypeScript types for an operation
 */
function generateOperationTypes(operationId: string, operation: OpenAPIV3.OperationObject): string {
  // Get the schema name from the response
  const responseObj = operation.responses["200"] as OpenAPIV3.ResponseObject;
  const responseSchema = responseObj?.content?.["application/json"]?.schema;

  // Handle different response schema structures
  let schemaRef: string | undefined;
  let metadataRef: string | undefined;
  let isArray = false;
  let arrayItemsRef: string | undefined;

  if (responseSchema) {
    if ("allOf" in responseSchema && responseSchema.allOf) {
      const dataSchema = responseSchema.allOf[1] as OpenAPIV3.SchemaObject;
      if (dataSchema.properties?.data) {
        const dataProperty = dataSchema.properties.data as OpenAPIV3.SchemaObject;
        if ("$ref" in dataProperty) {
          schemaRef = dataProperty.$ref as string;
        } else if (dataProperty.type === "array" && dataProperty.items) {
          isArray = true;
          if ("$ref" in dataProperty.items) {
            arrayItemsRef = dataProperty.items.$ref;
          }
        }
      }

      if (dataSchema.properties?.metadata && "$ref" in dataSchema.properties.metadata) {
        metadataRef = dataSchema.properties.metadata.$ref;
      }
    } else if ("$ref" in responseSchema) {
      schemaRef = responseSchema.$ref;
    } else if (responseSchema.type === "array" && responseSchema.items && "$ref" in responseSchema.items) {
      isArray = true;
      arrayItemsRef = responseSchema.items.$ref;
    }
  }

  let responseType = "void";
  let metadataType = null;

  if (schemaRef) {
    // Direct reference case
    const schemaName = schemaRef.split("/").pop();
    responseType = `components['schemas']['${schemaName}']`;
  } else if (isArray && arrayItemsRef) {
    // Array with items reference case
    const itemSchemaName = arrayItemsRef.split("/").pop();
    responseType = `components['schemas']['${itemSchemaName}'][]`;
  }

  if (metadataRef) {
    const metadataSchemaName = metadataRef.split("/").pop();
    metadataType = `components['schemas']['${metadataSchemaName}']`;
  }

  // Check if this is a paginated response
  const isPaginated = metadataRef?.includes("PaginationResult");

  // Generate the final response type
  let finalResponseType = responseType;
  if (isPaginated) {
    finalResponseType = `APIResponseWithMetadata<${responseType}, ${metadataType}>`;
  }

  // Process parameters to generate the parameter type
  const queryParams =
    operation.parameters
      ?.filter((p) => {
        // Skip API key parameter
        if ("name" in p && p.name === "x-messari-api-key") return false;

        // Include query parameters and referenced parameters that are likely query params
        if ("in" in p && p.in === "query") return true;

        // Handle referenced parameters
        if ("$ref" in p) {
          const refParts = p.$ref.split("/");
          const paramName = refParts[refParts.length - 1];
          // Include common pagination parameters and other non-path parameters
          return paramName === "page" || paramName === "limit" || (!paramName.includes("path") && !paramName.includes("Path") && paramName !== "apiKey");
        }

        return false;
      })
      ?.map((p) => {
        // Get parameter name
        let paramName: string;
        let paramSchema: OpenAPIV3.SchemaObject | undefined;

        if ("$ref" in p) {
          // Handle referenced parameter
          const refParts = p.$ref.split("/");
          paramName = refParts[refParts.length - 1];

          // Set appropriate types for known parameters
          if (paramName === "page" || paramName === "limit") {
            return `${paramName}?: number`;
          }
        } else {
          paramName = p.name;
          paramSchema = p.schema as OpenAPIV3.SchemaObject;
        }

        // Get the parameter type from the schema
        let paramType = "string";
        if (paramSchema?.type) {
          if (paramSchema.type === "integer" || paramSchema.type === "number") {
            paramType = "number";
          } else if (paramSchema.type === "boolean") {
            paramType = "boolean";
          } else if (paramSchema.type === "array") {
            // Handle array types
            let itemType = "string";
            if (paramSchema.items && "type" in paramSchema.items && (paramSchema.items.type === "integer" || paramSchema.items.type === "number")) {
              itemType = "number";
            } else if (paramSchema.items && "type" in paramSchema.items && paramSchema.items.type === "boolean") {
              itemType = "boolean";
            }
            paramType = `${itemType}[]`;
          }
        }

        return `${paramName}${"required" in p && p.required ? "" : "?"}: ${paramType}`;
      })
      ?.join("; ") || "";

  const pathParams =
    operation.parameters
      ?.filter((p) => ("in" in p && p.in === "path") || ("$ref" in p && (p.$ref.includes("path") || p.$ref.includes("Path"))))
      ?.map((p) => {
        // Path parameters typically need to be strings for URL construction
        const paramName = "$ref" in p ? p.$ref.split("/").pop() : p.name;
        return `${paramName}: string`;
      })
      ?.join("; ") || "";

  let bodyType = null;
  if (
    operation.requestBody &&
    "content" in operation.requestBody &&
    operation.requestBody.content["application/json"]?.schema &&
    "$ref" in operation.requestBody.content["application/json"].schema
  ) {
    const bodySchemaRef = operation.requestBody.content["application/json"].schema.$ref;
    const bodySchemaName = bodySchemaRef.split("/").pop();
    bodyType = `components['schemas']['${bodySchemaName}']`;
  }

  const typeIntersection = [bodyType, queryParams ? `{ ${queryParams} }` : null, pathParams ? `{ ${pathParams} }` : null].filter(Boolean).join("; ");

  return `
export type ${operationId}Response = ${finalResponseType};
export type ${operationId}Error = components['schemas']['APIError'];

export type ${operationId}Parameters = ${typeIntersection || "null"};`;
}

/**
 * Generates an operation object for an operation
 */
function generateOperationObject(operationId: string, method: string, pathTemplate: string, operation: OpenAPIV3.OperationObject, spec: OpenAPISpec): string {
  const { queryParams, pathParams, bodyParams } = extractParameterNames(operation, spec);

  // Filter out the API key from query parameters
  const filteredQueryParams = queryParams.filter((p) => p !== "x-messari-api-key");

  return `
export const ${operationId} = {
  method: '${method.toUpperCase()}' as const,
  pathParams: [${pathParams.map((p) => `'${p}'`).join(", ")}] as const,
  queryParams: [${filteredQueryParams.map((p) => `'${p}'`).join(", ")}] as const,
  bodyParams: [${bodyParams.map((p) => `'${p}'`).join(", ")}] as const,
  path: ${generatePathFunction(pathTemplate, pathParams.length > 0)}
} as const;`;
}

/**
 * Processes the combined OpenAPI spec and generates operation types
 */
function processCombinedOpenAPISpec(filePath: string): string[] {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const spec = yaml.load(fileContent) as OpenAPISpec;
  const operations: string[] = [];

  // Add imports for common types
  operations.push(`import type { components } from './types';`);

  // Define APIResponseWithMetadata directly instead of importing it
  operations.push(`
// Define APIResponseWithMetadata as a generic type
export interface APIResponseWithMetadata<T = unknown, M = unknown> {
  /** @description Response payload */
  data: T;
  /** @description Error message if request failed */
  error?: string;
  /** @description Additional metadata about the response */
  metadata?: M;
}

// Define PathParams type for path functions
export type PathParams = Record<string, string>;`);
  operations.push("");

  // Process all paths and operations
  for (const [path, pathObj] of Object.entries(spec.paths)) {
    if (!pathObj) continue;

    for (const [method, operation] of Object.entries(pathObj)) {
      // Skip non-operation properties like parameters, summary, etc.
      if (!["get", "post", "put", "delete", "patch", "options", "head", "trace"].includes(method)) {
        continue;
      }

      const typedOperation = operation as OpenAPIV3.OperationObject;
      if (typedOperation.operationId) {
        operations.push(generateOperationTypes(typedOperation.operationId, typedOperation));
        operations.push(generateOperationObject(typedOperation.operationId, method, path, typedOperation, spec));
      }
    }
  }

  return operations;
}

/**
 * Generates exports for all schema types from the components section
 */
function generateSchemaExports(spec: OpenAPISpec): string[] {
  if (!spec.components?.schemas) {
    return [];
  }

  const exports: string[] = [];

  // Add header comment
  exports.push(`/**
 * Auto-generated schema types from OpenAPI specification.
 * DO NOT EDIT MANUALLY.
 */

import type { components } from './types';

// Export all schema types from components`);

  // Generate exports for each schema
  for (const schemaName of Object.keys(spec.components.schemas)) {
    exports.push(`export type ${schemaName} = components['schemas']['${schemaName}'];`);
  }
  
  // Alphabetize the exports for readability + easier diffs
  exports.sort();

  return exports;
}

/**
 * Main function to generate operation types
 */
function main(): void {
  const typesDir = path.resolve(__dirname, "../../packages/types/src");
  const combinedSpecPath = path.resolve(__dirname, "../openapi/dist/combined.yaml");

  // Check if the combined spec exists
  if (!fs.existsSync(combinedSpecPath)) {
    console.error("❌ Combined spec not found. Run api:bundle first.");
    process.exit(1);
  }

  // Load the combined spec for schema generation
  const yamlContent = fs.readFileSync(combinedSpecPath, "utf8");
  const combinedSpec = yaml.load(yamlContent) as OpenAPISpec;

  // Generate operation types from the combined spec
  const operations = processCombinedOpenAPISpec(combinedSpecPath);

  // Create the index.ts file
  const indexPath = path.join(typesDir, "index.ts");
  fs.writeFileSync(indexPath, operations.join("\n\n"));
  console.log("✅ Generated index.ts");

  // Generate schema.ts file with all component schema exports
  const schemaExports = generateSchemaExports(combinedSpec);
  const schemaPath = path.join(typesDir, "schema.ts");
  fs.writeFileSync(schemaPath, schemaExports.join("\n\n"));
  console.log("✅ Generated schema.ts");

  // Create a barrel file to re-export types from types.ts and schema.ts
  const typesPath = path.join(typesDir, "types.ts");
  if (fs.existsSync(typesPath)) {
    // Add export statement at the end of index.ts to re-export everything from types.ts and schema.ts
    const indexContent = fs.readFileSync(indexPath, "utf8");
    let updatedContent = indexContent;

    if (!indexContent.includes("export * from './schema'")) {
      updatedContent += "\n\n// Re-export schema types\nexport * from './schema';\n";
    }

    if (updatedContent !== indexContent) {
      fs.writeFileSync(indexPath, updatedContent);
      console.log("✅ Updated index.ts to re-export types from schema.ts");
    }
  } else {
    console.error("❌ types.ts not found. Run generate-types.sh first.");
    process.exit(1);
  }
}

// Run the script
main();

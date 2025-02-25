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

import fs from "fs";
import path from "path";
import yaml from "js-yaml";

interface OpenAPISpec {
  paths: {
    [path: string]: {
      [method: string]: {
        operationId?: string;
        parameters?: any[];
        requestBody?: any;
        responses?: any;
      };
    };
  };
  components?: {
    schemas?: {
      [key: string]: any;
    };
  };
}

function generatePathFunction(
  pathTemplate: string,
  hasParams: boolean
): string {
  if (!hasParams) {
    return `() => '${pathTemplate}'`;
  }
  return `(p: PathParams) => \`${pathTemplate.replace(
    /{([^}]+)}/g,
    "${p.$1}"
  )}\``;
}

function getSchemaProperties(schema: any, spec: OpenAPISpec): string[] {
  if (!schema) return [];

  if (schema.$ref) {
    const refPath = schema.$ref.split("/");
    const schemaName = refPath[refPath.length - 1];
    const refSchema = spec.components?.schemas?.[schemaName];
    return refSchema?.properties ? Object.keys(refSchema.properties) : [];
  }

  return schema.properties ? Object.keys(schema.properties) : [];
}

function extractParameterNames(
  operation: any,
  spec: OpenAPISpec
): { queryParams: string[]; pathParams: string[]; bodyParams: string[] } {
  // Process parameters directly defined in the operation
  const processParams = (params: any[]) => {
    if (!params) return { queryParams: [], pathParams: [] };

    const queryParams: string[] = [];
    const pathParams: string[] = [];

    params.forEach((p: any) => {
      // Handle parameter references
      if (p.$ref) {
        // For parameters like '#/components/parameters/page', we want to extract 'page'
        const refParts = p.$ref.split("/");
        const paramName = refParts[refParts.length - 1];

        // Skip API key parameter
        if (paramName === "apiKey" || paramName === "x-messari-api-key") {
          return;
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
    });

    return { queryParams, pathParams };
  };

  const { queryParams, pathParams } = processParams(operation.parameters || []);

  const bodySchema =
    operation.requestBody?.content?.["application/json"]?.schema;
  const bodyParams = getSchemaProperties(bodySchema, spec);

  return { queryParams, pathParams, bodyParams };
}

function generateOperationTypes(
  operationId: string,
  operation: any,
  serviceName: string
): string {
  // Get the schema name from the response
  const responseSchema =
    operation.responses["200"]?.content["application/json"]?.schema;
  const schemaRef = responseSchema?.allOf?.[1]?.properties?.data?.$ref;
  const metadataRef = responseSchema?.allOf?.[1]?.properties?.metadata?.$ref;

  // Check for array type with items that have a $ref
  const isArray =
    responseSchema?.allOf?.[1]?.properties?.data?.type === "array";
  const arrayItemsRef =
    responseSchema?.allOf?.[1]?.properties?.data?.items?.$ref;

  let responseType = "void";
  let metadataType = null;

  if (schemaRef) {
    // Direct reference case
    const schemaName = schemaRef.split("/").pop();
    responseType = `${serviceName}Components['schemas']['${schemaName}']`;
  } else if (isArray && arrayItemsRef) {
    // Array with items reference case
    const itemSchemaName = arrayItemsRef.split("/").pop();
    responseType = `${serviceName}Components['schemas']['${itemSchemaName}'][]`;
  }

  if (metadataRef) {
    const metadataSchemaName = metadataRef.split("/").pop();
    metadataType = `${serviceName}Components['schemas']['${metadataSchemaName}']`;
  }

  // Check if this is a paginated response
  const isPaginated = metadataRef && metadataRef.includes("PaginationResult");

  // Generate the final response type
  let finalResponseType = responseType;
  if (isPaginated) {
    finalResponseType = `APIResponseWithMetadata<${responseType}, ${metadataType}>`;
  }

  // Process parameters to generate the parameter type
  const queryParams = operation.parameters
    ?.filter((p: any) => {
      // Skip API key parameter
      if (p.name === "x-messari-api-key") return false;

      // Include query parameters and referenced parameters that are likely query params
      if (p.in === "query") return true;

      // Handle referenced parameters
      if (p.$ref) {
        const refParts = p.$ref.split("/");
        const paramName = refParts[refParts.length - 1];
        // Include common pagination parameters and other non-path parameters
        return (
          paramName === "page" ||
          paramName === "limit" ||
          (!paramName.includes("path") &&
            !paramName.includes("Path") &&
            paramName !== "apiKey")
        );
      }

      return false;
    })
    .map((p: any) => {
      // Get parameter name
      let paramName;
      let paramSchema;

      if (p.$ref) {
        // Handle referenced parameter
        const refParts = p.$ref.split("/");
        paramName = refParts[refParts.length - 1];

        // Set appropriate types for known parameters
        if (paramName === "page" || paramName === "limit") {
          return `${paramName}?: number`;
        }
      } else {
        paramName = p.name;
        paramSchema = p.schema;
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
          if (
            paramSchema.items?.type === "integer" ||
            paramSchema.items?.type === "number"
          ) {
            itemType = "number";
          } else if (paramSchema.items?.type === "boolean") {
            itemType = "boolean";
          }
          paramType = `${itemType}[]`;
        }
      }

      return `${paramName}${p.required ? "" : "?"}: ${paramType}`;
    })
    .join("; ");

  const pathParams = operation.parameters
    ?.filter(
      (p: any) =>
        p.in === "path" ||
        (p.$ref && (p.$ref.includes("path") || p.$ref.includes("Path")))
    )
    .map((p: any) => {
      // Path parameters typically need to be strings for URL construction
      const paramName = p.$ref ? p.$ref.split("/").pop() : p.name;
      return `${paramName}: string`;
    })
    .join("; ");

  let bodyType = null;
  if (operation.requestBody) {
    const bodySchemaRef =
      operation.requestBody.content["application/json"].schema.$ref;
    const bodySchemaName = bodySchemaRef.split("/").pop();
    bodyType = `${serviceName}Components['schemas']['${bodySchemaName}']`;
  }

  const typeIntersection = [
    bodyType,
    queryParams ? `{ ${queryParams} }` : null,
    pathParams ? `{ ${pathParams} }` : null,
  ]
    .filter(Boolean)
    .join("; ");

  return `
export type ${operationId}Response = ${finalResponseType};
export type ${operationId}Error = ${serviceName}Components['schemas']['APIError'];

export type ${operationId}Parameters = ${typeIntersection};`;
}

function generateOperationObject(
  operationId: string,
  method: string,
  pathTemplate: string,
  operation: any,
  spec: OpenAPISpec
): string {
  const { queryParams, pathParams, bodyParams } = extractParameterNames(
    operation,
    spec
  );

  // Filter out the API key from query parameters
  const filteredQueryParams = queryParams.filter(
    (p) => p !== "x-messari-api-key"
  );

  return `
export const ${operationId} = {
  method: '${method.toUpperCase()}' as const,
  pathParams: [${pathParams.map((p) => `'${p}'`).join(", ")}] as const,
  queryParams: [${filteredQueryParams
    .map((p) => `'${p}'`)
    .join(", ")}] as const,
  bodyParams: [${bodyParams.map((p) => `'${p}'`).join(", ")}] as const,
  path: ${generatePathFunction(pathTemplate, pathParams.length > 0)}
} as const;`;
}

function processOpenAPIFile(filePath: string): string[] {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const spec = yaml.load(fileContent) as OpenAPISpec;
  const operations: string[] = [];

  // Extract service name from file path
  const serviceName = path.basename(filePath, ".yaml");

  Object.entries(spec.paths).forEach(([path, pathObj]) => {
    Object.entries(pathObj).forEach(([method, operation]) => {
      if (operation.operationId) {
        operations.push(
          generateOperationTypes(operation.operationId, operation, serviceName)
        );
        operations.push(
          generateOperationObject(
            operation.operationId,
            method,
            path,
            operation,
            spec
          )
        );
      }
    });
  });

  return operations;
}

function generateIndex(): void {
  const distDir = path.join(process.cwd(), "typegen", "openapi", "dist");
  const outputDir = path.join(process.cwd(), "packages", "types", "src");

  const operations: string[] = [];
  const serviceFiles: string[] = [];
  const serviceSchemas: Record<string, string[]> = {};

  // First pass: collect all schema names for each service
  fs.readdirSync(distDir)
    .filter((file) => file.endsWith(".yaml"))
    .forEach((file) => {
      const serviceName = file.replace(".yaml", "");
      const filePath = path.join(distDir, file);
      const fileContent = fs.readFileSync(filePath, "utf8");
      const spec = yaml.load(fileContent) as OpenAPISpec;

      // Get all schema names from the components section
      const schemaNames = spec.components?.schemas
        ? Object.keys(spec.components.schemas)
        : [];
      serviceSchemas[serviceName] = schemaNames;
      serviceFiles.push(serviceName);
    });

  // Second pass: process operations
  fs.readdirSync(distDir)
    .filter((file) => file.endsWith(".yaml"))
    .forEach((file) => {
      const serviceName = file.replace(".yaml", "");
      const filePath = path.join(distDir, file);
      operations.push(...processOpenAPIFile(filePath));
    });

  // Generate imports for all services
  const imports = serviceFiles
    .map(
      (service) =>
        `import { components as ${service}Components } from './${service}';`
    )
    .join("\n");

  // Create a components type that uses the first service's components as the base
  // This assumes common types like APIError are the same across services
  const baseService = serviceFiles[0] || "ai";
  const componentsType = `type components = ${baseService}Components;`;

  // Export the components with service name prefixes
  let exportedComponents = serviceFiles
    .map(
      (service) =>
        `export type ${service}ComponentsType = ${service}Components;`
    )
    .join("\n");

  // Export all schema types for each service
  for (const service of serviceFiles) {
    const schemas = serviceSchemas[service];
    if (schemas && schemas.length > 0) {
      exportedComponents += "\n\n// " + service + " types\n";
      for (const schema of schemas) {
        exportedComponents += `export type ${service}${schema} = ${service}Components['schemas']['${schema}'];\n`;
      }
    }
  }

  // Add the APIResponseWithMetadata generic type
  const apiResponseWithMetadataType = `
// Generic type for API responses with metadata
export interface APIResponseWithMetadata<T, M> {
  data: T;
  metadata?: M;
  error?: string;
}`;

  // Add the PathParams type definition
  const pathParamsType = `
// Define PathParams type for path parameter functions
export type PathParams = Record<string, string>;`;

  const indexContent = `// This file is auto-generated. DO NOT EDIT
${imports}

${componentsType}
${exportedComponents}
${apiResponseWithMetadataType}
${pathParamsType}

${operations.join("\n\n")}
`;

  fs.writeFileSync(path.join(outputDir, "index.ts"), indexContent);
}

generateIndex();

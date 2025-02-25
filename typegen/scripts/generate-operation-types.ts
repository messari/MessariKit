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
  const queryParams =
    operation.parameters
      ?.filter((p: any) => p.in === "query")
      .map((p: any) => p.name) || [];

  const pathParams =
    operation.parameters
      ?.filter((p: any) => p.in === "path")
      .map((p: any) => p.name) || [];

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

  let responseType = "void";
  let metadataType = null;

  if (schemaRef) {
    const schemaName = schemaRef.split("/").pop();
    responseType = `${serviceName}Components['schemas']['${schemaName}']`;
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

  const queryParams = operation.parameters
    ?.filter((p: any) => p.in === "query" && p.name !== "x-messari-api-key")
    .map((p: any) => `${p.name}${p.required ? "" : "?"}: string`)
    .join("; ");

  const pathParams = operation.parameters
    ?.filter((p: any) => p.in === "path")
    .map((p: any) => `${p.name}: string`)
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

  const indexContent = `// This file is auto-generated. DO NOT EDIT
${imports}

${componentsType}
${exportedComponents}
${apiResponseWithMetadataType}

${operations.join("\n\n")}
`;

  fs.writeFileSync(path.join(outputDir, "index.ts"), indexContent);
}

generateIndex();

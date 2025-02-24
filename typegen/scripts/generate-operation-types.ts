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

function generateOperationTypes(operationId: string, operation: any): string {
  const responseType = operation.responses["200"]?.content["application/json"]
    ?.schema
    ? `components['schemas']['${operation.responses["200"].content[
        "application/json"
      ].schema.allOf[1].properties.data.$ref
        .split("/")
        .pop()}']`
    : "void";

  const queryParams = operation.parameters
    ?.filter((p: any) => p.in === "query" && p.name !== "x-messari-api-key")
    .map((p: any) => `${p.name}${p.required ? "" : "?"}: string`)
    .join(" & ");

  const pathParams = operation.parameters
    ?.filter((p: any) => p.in === "path")
    .map((p: any) => `${p.name}: string`)
    .join(" & ");

  const bodyType = operation.requestBody
    ? `components['schemas']['${operation.requestBody.content[
        "application/json"
      ].schema.$ref
        .split("/")
        .pop()}']`
    : null;

  const typeIntersection = [
    bodyType,
    queryParams ? `{ ${queryParams} }` : null,
    pathParams ? `{ ${pathParams} }` : null,
  ]
    .filter(Boolean)
    .join(" & ");

  return `
export type ${operationId}Response = ${responseType};
export type ${operationId}Error = components['schemas']['APIError'];

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

  Object.entries(spec.paths).forEach(([path, pathObj]) => {
    Object.entries(pathObj).forEach(([method, operation]) => {
      if (operation.operationId) {
        operations.push(
          generateOperationTypes(operation.operationId, operation)
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

  fs.readdirSync(distDir)
    .filter((file) => file.endsWith(".yaml"))
    .forEach((file) => {
      const filePath = path.join(distDir, file);
      operations.push(...processOpenAPIFile(filePath));
    });

  const indexContent = `// This file is auto-generated. DO NOT EDIT
import { components } from './ai';

${operations.join("\n\n")}
`;

  fs.writeFileSync(path.join(outputDir, "index.ts"), indexContent);
}

generateIndex();

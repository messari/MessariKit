# Messari Kit Type Generation

This directory contains the OpenAPI specifications and scripts for generating TypeScript types for the Messari API.

## ⚠️ Important: How to Generate Types

**Never run the generation scripts directly.** Always use the package.json scripts from the root directory.

### Correct Way to Generate Types

From the root directory of the project, run:

```bash
# Run the complete build process
pnpm api:build

# Or run individual steps if needed
pnpm api:validate  # Validates the OpenAPI spec
pnpm api:bundle    # Bundles the OpenAPI spec
pnpm api:types     # Generates TypeScript types
```

### Why This Matters

Running the scripts directly can lead to:
- Missing pagination parameters
- Incomplete type generation
- References not being properly resolved
- Inconsistent types across the codebase

The `api:build` script ensures that:
1. The OpenAPI spec is validated
2. The spec is properly bundled with all references resolved
3. The type generation scripts run in the correct order
4. All necessary parameters (including referenced ones) are properly included

## Directory Structure

- `/openapi/` - Contains the OpenAPI specifications
  - `/common/` - Common components and parameters used across services
  - `/services/` - Service-specific OpenAPI specs
  - `/dist/` - Generated bundled OpenAPI specs (created by `api:bundle`)
- `/scripts/` - Type generation scripts
  - `generate-operation-types.ts` - Generates operation types from the OpenAPI specs
  - `generate-types.sh` - Shell script that runs openapi-typescript

## Modifying the Type Generation Process

If you need to modify how types are generated:

1. Update the scripts in `typegen/scripts/`
2. Test your changes by running `pnpm api:build` from the root
3. Verify the generated types in `packages/types/src/`

## Common Issues

### Missing Pagination Parameters

If pagination parameters (`page`, `limit`) are missing from generated types, it's likely because:
- The parameters are referenced from the common parameters file
- The type generation script isn't properly resolving these references

The solution is to ensure that referenced parameters are properly handled in `generate-operation-types.ts`.

### Type Mismatches

If you encounter type mismatches between what's defined in the OpenAPI spec and what's generated:
1. Check the OpenAPI spec to ensure the types are correctly defined
2. Verify that the type generation script is correctly mapping OpenAPI types to TypeScript types
3. Run `pnpm api:build` to regenerate all types 
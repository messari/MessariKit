#!/bin/bash

# ⚠️ WARNING: DO NOT RUN THIS SCRIPT DIRECTLY ⚠️
#
# This script is part of the type generation process and should only be run
# through the package.json scripts from the root directory:
#
# - pnpm api:build - Runs the complete build process
# - pnpm api:types - Generates TypeScript types
#
# Running this script directly may result in incomplete type generation,
# missing pagination parameters, or other issues with the generated types.
#
# See the README.md in the typegen directory for more information.

# Ensure the output directory exists
mkdir -p packages/types/src

# Generate types from the combined spec
if [ -f "typegen/openapi/dist/combined.yaml" ]; then
    echo "Generating types from combined OpenAPI spec..."
    openapi-typescript "typegen/openapi/dist/combined.yaml" \
        --output "packages/types/src/types.ts" \
        --export-type \
        --root-types \
        --root-types-no-schema-prefix \
        --alphabetize \
        --enum-values \  # Generate true TS enums rather than string unions.
        --path-params-as-types false  # Leave false to avoid path name collisions with dynamic /{id} and /static paths
    
    echo "Combined type generation complete!"
else
    echo "Error: Combined spec not found at typegen/openapi/dist/combined.yaml"
    echo "Please run 'pnpm api:bundle' first to generate the combined spec."
    exit 1
fi 
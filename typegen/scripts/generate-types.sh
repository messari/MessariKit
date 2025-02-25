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

# Iterate over all yaml files in the dist directory
for file in typegen/openapi/dist/*.yaml; do
    # Get the base name without extension
    basename=$(basename "$file" .yaml)
    
    # Generate types for this file
    echo "Generating types for $basename..."
    openapi-typescript "$file" \
        --output "packages/types/src/${basename}.ts" \
        --export-type \
        --root-types \
        --root-types-no-schema-prefix \
        --alphabetize \
        --path-params-as-types 
done

echo "Type generation complete!" 
#!/bin/bash

# Ensure the output directory exists
mkdir -p packages/types/src

# Iterate over all yaml files in the dist directory
for file in typegen/openapi/dist/*.yaml; do
    # Get the base name without extension
    basename=$(basename "$file" .yaml)
    
    # Generate types for this file
    echo "Generating types for $basename..."
    openapi-typescript "$file" --output "packages/types/src/${basename}.ts"
done

echo "Type generation complete!" 
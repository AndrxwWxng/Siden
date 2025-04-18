#!/bin/bash

# Define the template for additions to add to route.ts files
read -r -d '' HEADER_TEMPLATE << 'EOF'
import { NextRequest } from "next/server";

// Define Next.js config for API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 30;

EOF

read -r -d '' OPTIONS_HANDLER << 'EOF'

// Add OPTIONS method handler for CORS preflight requests
export async function OPTIONS(req: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
EOF

# Function to add Vercel configs to a route file
process_route_file() {
  local file="$1"
  
  # Check if file exists
  if [ ! -f "$file" ]; then
    echo "File not found: $file"
    return
  fi
  
  echo "Processing $file..."
  
  # Check if the file already has the dynamic config
  if grep -q "export const dynamic" "$file"; then
    echo "File already has dynamic config, skipping..."
    return
  fi
  
  # Add the header template after the first import statement
  awk -v template="$HEADER_TEMPLATE" '
    /^import/ && !added {
      print $0
      print template
      added = 1
      next
    }
    {print}
  ' "$file" > "${file}.tmp"
  
  # Change Request to NextRequest
  sed -i '' 's/req: Request/req: NextRequest/g' "${file}.tmp"
  
  # Add the OPTIONS handler at the end of the file (before the last closing brace)
  awk -v options="$OPTIONS_HANDLER" '
    END {
      # Remove the last line
      for (i = 1; i < NR; i++) print lines[i]
      # Add options handler
      print options
      # Add back the last line
      print lines[NR]
    }
    {
      lines[NR] = $0
    }
  ' "${file}.tmp" > "${file}.tmp2"
  
  # Replace the original file
  mv "${file}.tmp2" "$file"
  rm -f "${file}.tmp"
  
  echo "Updated $file"
}

# Process all route.ts files in the specified directories
for route_file in src/app/api/chat/*/route.ts src/app/api/chat/route.ts src/app/api/mastra/*/route.ts src/app/api/*/route.ts; do
  # Skip files that don't exist (in case the glob doesn't match)
  if [ -f "$route_file" ]; then
    process_route_file "$route_file"
  fi
done

echo "All route files processed!" 
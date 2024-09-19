import * as fs from "node:fs";
import * as ts from "typescript";

import countiesData from "@/constants/us-counties.geojson";

const TYPES_PATH = "./src/types";

function pascalToKebab(pascal: string) {
  const kebab = pascal.replace(/([A-Z])/g, "-$1").toLowerCase();
  return `${kebab}.d.ts`;
}

function toTypeDefinition(name: string, properties: string[]) {
  return `
type ${name} = {
  ${properties.join("\n  ")}
};

declare const ${name.toLowerCase()}: ${name};
export default ${name.toLowerCase()};
export type { ${name} };
`;
}

function generateTypeDeclaration(
  obj: Record<string, unknown>,
  name: string,
): string {
  return toTypeDefinition(
    name,
    Object.entries(obj).map(([key, value]) => `${key}: ${typeof value};`),
  );
}

function writeTypeDeclaration(data: Record<string, any>, name: string) {
  const fn = pascalToKebab(name);
  const bytes = fs.writeFileSync(
    `${TYPES_PATH}/${fn}`,
    generateTypeDeclaration(data, name),
  );

  return {
    filename: fn,
    size: bytes,
  };
}

function build() {
  const { filename } = writeTypeDeclaration(countiesData, "CountyData");
  console.log(`${filename} generated successfully.`);
}

build();

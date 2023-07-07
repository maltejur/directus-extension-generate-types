import { Collections } from "../types";

export default async function generatePyTypes(collections: Collections | Promise<Collections>) {
  let ret = "";
  const types = [];

  if (collections instanceof Promise) {
    collections = await collections;
  }

  ret += `from typing import TypedDict\n\n`;

  ret += Object.values(collections)
    .map((collection) => {
      const collectionName = collection.collection;
      const typeName = collectionName
        .split("_")
        .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
        .join("");
      types.push(`${collectionName}: ${typeName}`);
      return `class ${typeName}(TypedDict):
${Object.values(collection.fields)
  .map((x) => `  ${x.field}: ${getType(x.type)}`)
  .join("\n")}`;
    })
    .join("\n\n");

  ret += "\n\n";

  ret += `class CustomDirectusTypes(TypedDict):
${types.map((x) => `  ${x}`).join("\n")}
`;

  ret += "\n";

  return ret;
}

function getType(directusType: string) {
  if (["integer", "bigInteger"].includes(directusType)) return "int";
  if (["float", "decimal"].includes(directusType)) return "float";
  if (["boolean"].includes(directusType)) return "bool";
  return "str";
}

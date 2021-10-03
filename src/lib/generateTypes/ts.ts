import { getCollections } from "../api";

export default async function generateTsTypes(api) {
  const collections = await getCollections(api);
  let ret = "";
  const types = [];

  ret += Object.values(collections)
    .map((collection) => {
      const collectionName = collection.collection;
      const typeName = collectionName
        .split("_")
        .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
        .join("");
      types.push(`${collectionName}: ${typeName}`);
      return `export type ${typeName} = {
${Object.values(collection.fields)
  .map((x) => `  ${x.field}${x.meta.required ? "" : "?"}: ${getType(x.type)};`)
  .join("\n")}
};`;
    })
    .join("\n\n");

  ret += "\n\n";

  ret += `export type CustomDirectusTypes = {
${types.map((x) => `  ${x};`).join("\n")}
};`;

  ret += "\n";

  return ret;
}

function getType(directusType: string) {
  if (["integer", "bigInteger", "float", "decimal"].includes(directusType))
    return "number";
  if (["boolean"].includes(directusType)) return "boolean";
  if (["json", "csv"].includes(directusType)) return "unknown";
  return "string";
}

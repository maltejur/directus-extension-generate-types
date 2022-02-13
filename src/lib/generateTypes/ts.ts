import { Field } from "lib/types";
import { getCollections } from "../api";

export default async function generateTsTypes(api) {
  const collections = await getCollections(api);
  let ret = "";
  const types = [];

  Object.values(collections).forEach((collection) => {
    const collectionName = collection.collection;
    const typeName = pascalCase(collectionName);
    types.push(`${collectionName}: ${typeName}`);
    ret += `export type ${typeName} = {\n`;
    collection.fields.forEach((field) => {
      ret += `  ${field.field}${
        field.schema?.is_nullable ? "?" : ""
      }: ${getType(field)};\n`;
    });
    ret += "};\n\n";
  });

  ret +=
    "export type CustomDirectusTypes = {\n" +
    types.map((x) => `  ${x};`).join("\n") +
    "\n};";

  ret += "\n";

  return ret;
}

function pascalCase(str: string) {
  return str
    .split(" ")
    .flatMap((x) => x.split("_"))
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
    .join("");
}

function getType(field: Field) {
  let type: string;
  if (["integer", "bigInteger", "float", "decimal"].includes(field.type))
    type = "number";
  else if (["boolean"].includes(field.type)) type = "boolean";
  else if (["json", "csv"].includes(field.type)) type = "unknown";
  else type = "string";
  if (field.relation) {
    type += ` & ${pascalCase(field.relation.collection)}${
      field.relation.type === "many" ? "[]" : ""
    }`;
  }
  return type;
}

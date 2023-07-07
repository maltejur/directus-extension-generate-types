import { Collections, Field } from '../types';

export default async function generateTsTypes(
  collections: Collections | Promise<Collections>,
  useIntersectionTypes = false
) {
  let ret = "";
  const types = [];

  if (collections instanceof Promise) {
    collections = await collections;
  }

  Object.values(collections).forEach((collection) => {
    const collectionName = collection.collection;
    const typeName = pascalCase(collectionName);
    types.push(`${collectionName}: ${typeName}`);
    ret += `export type ${typeName} = {\n`;
    collection.fields.forEach((field) => {
      if (field.meta?.interface?.startsWith("presentation-")) return;
      ret += "  ";
      ret += field.field.includes("-") ? `"${field.field}"` : field.field;
      if (field.schema?.is_nullable) ret += "?";
      ret += ": ";
      ret += getType(field, useIntersectionTypes);
      ret += ";\n";
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
    .flatMap((y) => y.split("-"))
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
    .join("");
}

function getType(field: Field, useIntersectionTypes = false) {
  let type: string;
  if (field.relation && field.relation.type === "many") {
    type = "any[]";
  } else {
    if (["integer", "bigInteger", "float", "decimal"].includes(field.type))
      type = "number";
    else if (["boolean"].includes(field.type)) type = "boolean";
    else if (["json", "csv"].includes(field.type)) type = "unknown";
    else type = "string";
  }
  if (field.relation) {
    type += useIntersectionTypes ? " & " : " | ";
    type += field.relation.collection
      ? pascalCase(field.relation.collection)
      : "any";
    if (field.relation.type === "many") type += "[]";
  }
  if (field.schema?.is_nullable) {
    if (field.relation && useIntersectionTypes) {
      type = `(${type}) | null`;
    } else {
      type += ` | null`;
    }
  }
  return type;
}

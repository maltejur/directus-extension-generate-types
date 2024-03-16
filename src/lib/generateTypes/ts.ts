import { Field } from "lib/types";
import { getCollections } from "../api";

export default async function generateTsTypes(
  api,
  useIntersectionTypes = false,
  sdk11 = true
) {
  const collections = await getCollections(api);
  let ret = "";
  const types = [];

  Object.values(collections).forEach((collection) => {
    const collectionName = collection.collection;
    const typeName = pascalCase(collectionName);
    const isSingleton = collection.meta?.singleton === true;
    types.push(
      sdk11
        ? `${collectionName}: ${typeName}${isSingleton ? "" : "[]"}`
        : `${collectionName}: ${typeName}`
    );
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

  // Add directus field types
  // @see https://github.com/directus/directus/blob/main/sdk/src/schema/field.ts
  ret += `export type FieldMetaConditionType = {
    // TODO: review
    hidden: boolean;
    name: string;
    options: FieldMetaConditionOptionType;
    readonly: boolean;
    required: boolean;
    // TODO: rules use atomic operators and can nest
    rule: unknown;
  };\n`;
  ret += `export type FieldMetaConditionOptionType = {
    // TODO: review
    clear: boolean;
    font: string;
    iconLeft?: string;
    iconRight?: string;
    masked: boolean;
    placeholder: string;
    slug: boolean;
    softLength?: number;
    trim: boolean;
  };\n`;

  ret += `export type FieldMetaTranslationType = {
    language: string;
    translation: string;
  };\n\n`;
  // END directus field types

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
    else if (["json", "csv"].includes(field.type)) type = getDirectusCollectionTypes(field);
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




/*
 * Define types for json / csv fields of Directus collection based on SDK11 type definitions
 * @see https://github.com/directus/directus/tree/main/sdk/src/schema for type definitions
 * 
 * last updated: 2023-09-23 (sdk v12.12.0.1)
*/
function getDirectusCollectionTypes(field: Field) { 
  if (!field.collection.startsWith('directus_')) {
    return "unknown";
  }

  if (field.collection === 'directus_collections' && field.field === 'item_duplication_fields') {
    return 'string[]';
  }
  
  if (field.collection === 'directus_collections' && field.field === 'translations') {
    return '{ language: string; plural: string; singular: string; translation: string;}[]';
  }
  
  if (field.collection === 'directus_fields' && field.field === 'conditions') {
    return 'FieldMetaConditionType[]';
  }
  
  if (field.collection === 'directus_fields' && field.field === 'display_options') {
    return 'Record<string, any>';
  }
  
  if (field.collection === 'directus_fields' && field.field === 'options') {
    return 'Record<string, any>';
  }
  
  if (field.collection === 'directus_fields' && field.field === 'special') {
    return 'string[]';
  }
  
  if (field.collection === 'directus_fields' && field.field === 'translations') {
    return 'FieldMetaTranslationType[] ';
  }
  
  if (field.collection === 'directus_fields' && field.field === 'validation') {
    return 'Record<string, any>';
  }
  
  if (field.collection === 'directus_files' && field.field === 'metadata') {
    return 'Record<string, any>';
  }
  
  if (field.collection === 'directus_files' && field.field === 'tags') {
    return 'string[]';
  }
  
  if (field.collection === 'directus_flows' && field.field === 'options') {
    return 'Record<string, any>';
  }
  
  if (field.collection === 'directus_operations' && field.field === 'options') {
    return 'Record<string, any>';
  }
  
  if (field.collection === 'directus_panels' && field.field === 'options') {
    return 'Record<string, any>';
  }
  
  if (field.collection === 'directus_permissions' && field.field === 'fields') {
    return 'string[]'; // note: sdk has typed it as string, but it must be string[] 
  }
  
  if (field.collection === 'directus_permissions' && field.field === 'permissions') {
    return 'Record<string, any>';
  }
  
  if (field.collection === 'directus_permissions' && field.field === 'presets') {
    return 'Record<string, any> ';
  }
  
  if (field.collection === 'directus_permissions' && field.field === 'validation') {
    return 'Record<string, any>';
  }
  
  if (field.collection === 'directus_presets' && field.field === 'filter') {
    return 'Record<string, any>';
  }
  
  if (field.collection === 'directus_presets' && field.field === 'layout_options') {
    return 'Record<string, any>';
  }
  
  if (field.collection === 'directus_presets' && field.field === 'layout_query') {
    return 'Record<string, any>';
  }
  
  if (field.collection === 'directus_relations' && field.field === 'one_allowed_collections') {
    return 'string';
  }
  
  if (field.collection === 'directus_revisions' && field.field === 'data') {
    return 'Record<string, any>';
  }
  
  if (field.collection === 'directus_revisions' && field.field === 'delta') {
    return 'Record<string, any>';
  }
  
  if (field.collection === 'directus_roles' && field.field === 'ip_access') {
    return 'string';
  }
  
  if (field.collection === 'directus_settings' && field.field === 'basemaps') {
    return 'Record<string, any>';
  }
  
  if (field.collection === 'directus_settings' && field.field === 'custom_aspect_ratios') {
    return 'Record<string, any>';
  }
  
  if (field.collection === 'directus_settings' && field.field === 'module_bar') {
    return 'Array<Record<string, any>>'; // note: sdk has typed it as json, which isn't valid
  }
  
  if (field.collection === 'directus_settings' && field.field === 'storage_asset_presets') {
    return '{ fit: string; height: number; width: number; quality: number; key: string; withoutEnlargement: boolean;}[]';
  }
  
  if (field.collection === 'directus_users' && field.field === 'auth_data') {
    return 'Record<string, any>';
  }
  
  if (field.collection === 'directus_users' && field.field === 'tags') {
    return 'string[]';
  }
  
  if (field.collection === 'directus_webhooks' && field.field === 'actions') {
    return 'string | string[]';
  }
  
  if (field.collection === 'directus_webhooks' && field.field === 'collections') {
    return 'string | string[]';
  }
  
  if (field.collection === 'directus_webhooks' && field.field === 'headers') {
    return 'Record<string, any>';
  }

  else { 
    return "unknown";
  }
}

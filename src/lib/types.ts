import type {
  Collection as DirectusCollection,
  Field as DirectusField,
} from "@directus/shared/types";

export type Field = DirectusField & {
  relation?: {
    type: "many" | "one";
    collection: string;
  };
};
export type Collection = DirectusCollection & { fields: Field[] };
export type Collections = { [collection: string]: Collection };

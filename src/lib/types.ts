import type {
  Collection as DirectusCollection,
  Field,
} from "@directus/shared/types";

export type Collection = DirectusCollection & { fields: Field[] };
export type Collections = { [collection: string]: Collection };

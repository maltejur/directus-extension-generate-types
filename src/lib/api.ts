import type { Collections } from "lib/types";
import {
  Collection as DirectusCollection,
  Field,
} from "@directus/shared/types";
import type { AxiosResponse } from "axios";

export async function getCollections(api) {
  const collectionsRes: AxiosResponse<{ data: DirectusCollection[] }> =
    await api.get("/collections?limit=-1");
  const rawCollections = collectionsRes.data.data;
  const collections: Collections = {};
  rawCollections.forEach(
    (collection) =>
      (collections[collection.collection] = { ...collection, fields: [] })
  );
  const fieldsRes: AxiosResponse<{ data: Field[] }> = await api.get(
    "/fields?limit=-1"
  );
  const fields = fieldsRes.data.data;
  fields.forEach((field) => {
    if (!collections[field.collection]) {
      console.warn(`generate-types:
${field.collection} not found`);
      return;
    }
    collections[field.collection].fields.push(field);
  });
  return collections;
}

import type { Collections, Field } from "lib/types";
import {
  Collection as DirectusCollection,
  Relation,
} from "@directus/shared/types";
import type { AxiosResponse } from "axios";
import { warn } from "./console";

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
      warn(`${field.collection} not found`);
      return;
    }
    collections[field.collection].fields.push(field);
  });
  Object.keys(collections).forEach((key) => {
    if (collections[key].fields.length === 0) delete collections[key];
  });
  const relationsRes: AxiosResponse<{ data: Relation[] }> = await api.get(
    "/relations?limit=-1"
  );
  const relations = relationsRes.data.data;
  relations.forEach((relation) => {
    const oneField = collections[relation.meta.one_collection]?.fields.find(
      (field) => field.field === relation.meta.one_field
    );
    const manyField = collections[relation.meta.many_collection]?.fields.find(
      (field) => field.field === relation.meta.many_field
    );
    if (oneField)
      oneField.relation = {
        type: "many",
        collection: relation.meta.many_collection,
      };
    if (manyField)
      manyField.relation = {
        type: "one",
        collection: relation.meta.one_collection,
      };
  });
  return collections;
}

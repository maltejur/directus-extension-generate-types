import type { Collections } from "../types";
import { warn } from "../console";

export async function gatherCollectionsData(
  rawCollections,
  rawFields,
  rawRelations
) {
  const collections: Collections = {};
  rawCollections
    .sort((a, b) => a.collection.localeCompare(b.collection))
    .forEach(
      (collection) =>
        (collections[collection.collection] = { ...collection, fields: [] })
    );

  rawFields
    .sort((a, b) => a.field.localeCompare(b.field))
    .forEach((field) => {
      if (!collections[field.collection]) {
        warn(`${field.collection} not found`);
        return;
      }
      collections[field.collection].fields.push(field);
    });

  Object.keys(collections).forEach((key) => {
    if (collections[key].fields.length === 0) delete collections[key];
  });

  rawRelations.forEach((relation) => {
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

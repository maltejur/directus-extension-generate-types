import type { Field } from "../../lib/types";
import {
  Collection as DirectusCollection,
  Relation,
} from "@directus/shared/types";
import type { AxiosResponse } from "axios";
import { gatherCollectionsData } from "../../lib/generate-types/utils";

export async function getCollections(api) {
  const collectionsResponse: AxiosResponse<{ data: DirectusCollection[] }>
    = await api.get("/collections?limit=-1");

  const fieldsResponse: AxiosResponse<{ data: Field[] }> = await api.get(
    "/fields?limit=-1"
  );

  const relationsResponse: AxiosResponse<{ data: Relation[] }> = await api.get(
    "/relations?limit=-1"
  );

  return gatherCollectionsData(
    collectionsResponse.data.data,
    fieldsResponse.data.data,
    relationsResponse.data.data,
  );
}


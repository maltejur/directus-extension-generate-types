import { AxiosResponse } from "axios";

export default async function generateOasTypes(api) {
  const response: AxiosResponse = await api.get("/server/specs/oas");
  return JSON.stringify(response.data, null, 2);
}

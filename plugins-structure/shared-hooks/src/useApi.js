import { useQuery } from "react-query";
import axios from "axios";
import get from "lodash/fp/get";

/**
 * Fetch api and returns an object with every info about the fetch and the api info in the data object.
 * This request should always be the first contact with the server.
 */
export function useApi() {
  const apiInfo = useQuery("api", async () => {
    const res = await axios.get("/api");
    sessionStorage.csrf = get("x-csrf-token", res.headers);
    return res.data;
  }, {
    refetchOnWindowFocus: false
  })
  return apiInfo;
}
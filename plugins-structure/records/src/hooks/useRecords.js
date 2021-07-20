import axios from "axios";
import take from "lodash/fp/take";
import without from "lodash/fp/without";
import { useInfiniteQuery } from "react-query";
import { getPostHeaders } from "@politeiagui/shared";
import { RECORDS_API_ROUTE, ROUTE_RECORDS, RECORDS_PAGE_SIZE } from "../constants";

function fetchRecords(records) {
  const requests = records.map((token) => ({token, filenames:["proposalmetadata.json","votemetadata.json"]}))
  return axios({
    method: "POST",
    url: `${RECORDS_API_ROUTE}${ROUTE_RECORDS}`,
    data: {
      requests
    },
    headers: getPostHeaders(sessionStorage.csrf),
    withCredentials: true
  })
  .then(res => res.data)
}

export function useRecords({records, status = 0, state = 0, enabled} = {}) {
  const recordsInfo = useInfiniteQuery(["records", state, status], ({pageParam = records }) => {
    const recordsToBatch = take(RECORDS_PAGE_SIZE, pageParam);
    return fetchRecords(recordsToBatch);
  }, {
    refetchOnWindowFocus: false,
    enabled: Array.isArray(records) && records.length > 0 && enabled,
    getNextPageParam: (_, allPages) => {
      const fetched = allPages.flatMap(page => Object.keys(page.records));
      const notFetched = without(fetched, records);
      return notFetched.length ? notFetched : false;
    }
  })
  return recordsInfo;
}
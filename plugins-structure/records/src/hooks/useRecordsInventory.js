import axios from "axios";
import { useInfiniteQuery } from "react-query";
import { getPostHeaders } from "@politeiagui/shared";
import { RECORDS_API_ROUTE, ROUTE_INVENTORY } from "../constants";
import { getRecordStateCode, getRecordStatusCode } from "../utils";

export function fetchInventory(state, status) {
  return function ({pageParam = 1}) {
    return axios({
      method: "POST",
      url: `${RECORDS_API_ROUTE}${ROUTE_INVENTORY}`,
      data: {
        state,
        status,
        page: pageParam
      },
      headers: getPostHeaders(sessionStorage.csrf),
      withCredentials: true
    })
    .then(res => res.data)
  }
}

export function useRecordsInventory({state, status} = {}) {
  const stateCode = getRecordStateCode(state);
  const statusCode = getRecordStatusCode(status);
  const recordsInventory = useInfiniteQuery(["recordsInventory", state, status], fetchInventory(stateCode, statusCode), {
    // only run this query if the csrf is available
    enabled: Boolean(sessionStorage.csrf),
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage && lastPage[state] && lastPage[state][status] && lastPage[state][status].length === 20) {
        return allPages.length + 1;
      }
      return false;
    }
  })
  return recordsInventory;
}
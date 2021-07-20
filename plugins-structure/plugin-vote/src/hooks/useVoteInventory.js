import axios from "axios";
import { useInfiniteQuery } from "react-query";
import { getPostHeaders } from "@politeiagui/shared";
import { TICKETVOTE_API_ROUTE, ROUTE_INVENTORY } from "../constants";
import { getVoteStatusCode } from "../utils";

export function fetchInventory(status) {
  return function ({pageParam = 1}) {
    return axios({
      method: "POST",
      url: `${TICKETVOTE_API_ROUTE}${ROUTE_INVENTORY}`,
      data: {
        status,
        page: pageParam
      },
      headers: getPostHeaders(sessionStorage.csrf),
      withCredentials: true
    })
    .then(res => res.data)
  }
}

export function useVoteInventory({status, enabled} = {}) {
  const statusCode = getVoteStatusCode(status);
  const voteInventory = useInfiniteQuery(["voteInventory", status], fetchInventory(statusCode), {
    // only run this query if the csrf is available
    enabled: Boolean(sessionStorage.csrf) && enabled,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage && lastPage?.vetted && lastPage.vetted[status] && lastPage.vetted[status].length === 20) {
        return allPages.length + 1;
      }
      return false;
    }
  })
  return voteInventory;
}
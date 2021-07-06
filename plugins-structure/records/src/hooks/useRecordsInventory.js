import axios from "axios";
import { useQuery } from "react-query";
import { getPostHeaders } from "@politeiagui/shared";
import { RECORDS_API_ROUTE, ROUTE_INVENTORY } from "../constants";
import { getHumanReadableRecordStatus, getHumanReadableRecordState } from "../utils";

function fetchInventory({state = 0, status = 0, page = 0} = {}) {
  return axios({
    method: "POST",
    url: `${RECORDS_API_ROUTE}${ROUTE_INVENTORY}`,
    data: {
      state,
      status,
      page
    },
    headers: getPostHeaders(sessionStorage.csrf),
    withCredentials: true
  })
  .then(res => res.data)
}

export function useRecordsInventory({state = 0, status = 0, page = 0} = {}) {
  const recordsInventory = useQuery(["recordsInventory", getHumanReadableRecordState(state), getHumanReadableRecordStatus(status), page], () => fetchInventory({state, status, page}), {
    // only run this query if the csrf is available
    enabled: Boolean(sessionStorage.csrf),
    keepPreviousData: true,
    refetchOnWindowFocus: false
  })
  return recordsInventory;
}
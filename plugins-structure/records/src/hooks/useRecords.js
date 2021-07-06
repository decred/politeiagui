import axios from "axios";
import take from "lodash/fp/take";
import { useQuery } from "react-query";
import { getPostHeaders } from "@politeiagui/shared";
import { RECORDS_API_ROUTE, ROUTE_RECORDS } from "../constants";
import { getHumanReadableRecordStatus, getHumanReadableRecordState } from "../utils";

function fetchRecords(records) {
  const requests = records.map((token) => ({token, filenames:["proposalmetadata.json","votemetadata.json"]}))
  return axios({
    method: "POST",
    url: `${RECORDS_API_ROUTE}${ROUTE_RECORDS}`,
    data: {
      requests: take(5, requests)
    },
    headers: getPostHeaders(sessionStorage.csrf),
    withCredentials: true
  })
  .then(res => res.data)
}

export function useRecords({records = undefined, status = 0, state = 0} = {}) {
  console.log(records);
  const recordsInfo = useQuery(["records", getHumanReadableRecordState(state), getHumanReadableRecordStatus(status)], () => fetchRecords(records), {
    refetchOnWindowFocus: false,
    enabled: Boolean(records)
  })
  return recordsInfo;
}
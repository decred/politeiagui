import { records } from "../records";
import { getTokensToFetch } from "@politeiagui/core/records/utils";
import isEmpty from "lodash/isEmpty";

export async function fetchRecordDetails(
  state,
  dispatch,
  { token, detailsFetched }
) {
  if (!detailsFetched) await dispatch(records.fetchDetails({ token }));
}

export async function fetchNextRecords(
  state,
  dispatch,
  { inventoryList, filenames }
) {
  const {
    records: { records: recordsObj, status },
    recordsPolicy: {
      policy: { recordspagesize },
    },
  } = state;

  const recordsToFetch = getTokensToFetch({
    inventoryList,
    lookupTable: recordsObj,
    pageSize: recordspagesize,
  });

  if (status !== "loading" && !isEmpty(recordsToFetch)) {
    dispatch(
      records.fetch({
        tokens: recordsToFetch,
        filenames,
      })
    );
  }
}

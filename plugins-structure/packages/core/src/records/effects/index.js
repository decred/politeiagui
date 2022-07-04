import { records } from "../records";
import { getTokensToFetch } from "@politeiagui/core/records/utils";
import isEmpty from "lodash/isEmpty";

function getDetailsFetched(state, token) {
  const storeToken = records.selectFullToken(state, token);
  if (storeToken) {
    const record = records.selectByToken(state, storeToken);
    if (record.files.length === 2) {
      return true;
    }
    return false;
  }
  return false;
}

export async function fetchRecordDetails(state, dispatch, { token }) {
  if (!getDetailsFetched(state, token))
    await dispatch(records.fetchDetails({ token }));
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

import { records } from "./";
import { getTokensToFetch } from "../utils";
import isEmpty from "lodash/isEmpty";

export async function fetchRecordDetails(state, dispatch, { token }) {
  const record = records.selectByToken(state, token);
  if (!record?.detailsFetched) {
    await dispatch(records.fetchDetails({ token }));
  }
}

export async function fetchNextRecords(
  state,
  dispatch,
  { inventoryList, filenames }
) {
  const {
    records: { records: recordsObj },
    recordsPolicy: {
      policy: { recordspagesize }
    }
  } = state;

  const recordsToFetch = getTokensToFetch({
    inventoryList,
    lookupTable: recordsObj,
    pageSize: recordspagesize
  });

  if (!isEmpty(recordsToFetch)) {
    dispatch(
      records.fetch({
        tokens: recordsToFetch,
        filenames
      })
    );
  }
}

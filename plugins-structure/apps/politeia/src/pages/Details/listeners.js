import { records } from "@politeiagui/core/records";
import { fetchRecordTicketvoteSummaries } from "@politeiagui/ticketvote/effects";
import { fetchProposalDetails } from "./actions";
import { fetchRecordComments } from "@politeiagui/comments/effects";
import { fetchRecordPiSummaries } from "../../pi/effects";
import { fetchRecordDetails } from "@politeiagui/core/records/effects";

async function getFullToken(state, dispatch, token) {
  const storeToken = records.selectFullToken(state, token);
  if (storeToken) {
    const record = records.selectByToken(state, storeToken);
    // means details was already fetched
    if (record.files.length === 2) {
      return [storeToken, true];
    }
    return [storeToken, false];
  }
  const res = await dispatch(records.fetchDetails({ token }));
  const fetchedRecord = res.payload;
  return [fetchedRecord?.censorshiprecord?.token, true];
}

export const listeners = [
  {
    actionCreator: fetchProposalDetails,
    effect: async (
      { payload },
      { getState, dispatch, unsubscribe, subscribe }
    ) => {
      unsubscribe();
      const state = getState();
      const [fullToken, detailsFetched] = await getFullToken(
        state,
        dispatch,
        payload
      );
      await Promise.all([
        fetchRecordDetails(state, dispatch, {
          token: fullToken,
          detailsFetched,
        }),
        fetchRecordComments(state, dispatch, { token: fullToken }),
        fetchRecordTicketvoteSummaries(state, dispatch, { token: fullToken }),
        fetchRecordPiSummaries(state, dispatch, { token: fullToken }),
      ]);
      subscribe();
    },
  },
];

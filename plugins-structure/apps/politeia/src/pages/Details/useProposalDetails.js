import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { recordsTimestamps } from "@politeiagui/core/records/timestamps";
import { fetchProposalDetails } from "./actions";
import { selectDetailsStatus, selectFullTokenFromStore } from "./selectors";
import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { recordComments } from "@politeiagui/comments/comments";
import { piSummaries } from "../../pi";

function useProposalDetails({ token }) {
  const dispatch = useDispatch();
  const detailsStatus = useSelector(selectDetailsStatus);
  const fullToken = useSelector((state) =>
    selectFullTokenFromStore(state, token)
  );
  const record = useSelector((state) =>
    records.selectByToken(state, fullToken)
  );
  const voteSummary = useSelector((state) =>
    ticketvoteSummaries.selectByToken(state, fullToken)
  );
  const comments = useSelector((state) =>
    recordComments.selectByToken(state, fullToken)
  );
  const piSummary = useSelector((state) =>
    piSummaries.selectByToken(state, fullToken)
  );

  async function onFetchRecordTimestamps({ token, version }) {
    const res = await dispatch(recordsTimestamps.fetch({ token, version }));
    return res.payload;
  }
  async function onFetchPreviousVersions(version) {
    const res = await dispatch(records.fetchDetails({ token, version }));
    return res.payload;
  }

  useEffect(() => {
    dispatch(fetchProposalDetails(token));
  }, [token, dispatch]);

  return {
    comments,
    // TODO: error selector
    // detailsError,
    detailsStatus,
    fullToken,
    onFetchPreviousVersions,
    onFetchRecordTimestamps,
    piSummary,
    record,
    voteSummary,
  };
}

export default useProposalDetails;

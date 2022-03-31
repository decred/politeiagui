import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import {
  fetchProposalDetails,
  fetchProposalTimestamps,
  selectDetailsError,
  selectDetailsStatus,
  selectFullToken,
} from "./detailsSlice";
import ProposalDetails from "../../components/Proposal/ProposalDetails";
import { Message } from "pi-ui";

function Details({ token }) {
  const dispatch = useDispatch();
  const fullToken = useSelector(selectFullToken);
  const record = useSelector((state) =>
    records.selectByToken(state, fullToken)
  );
  const voteSummary = useSelector((state) =>
    ticketvoteSummaries.selectByToken(state, fullToken)
  );
  const detailsStatus = useSelector(selectDetailsStatus);
  const detailsError = useSelector(selectDetailsError);
  const onFetchTimestamps = ({ token, version }) =>
    dispatch(fetchProposalTimestamps({ token, version }));

  useEffect(() => {
    dispatch(fetchProposalDetails(token));
  }, [token, dispatch]);

  return detailsStatus === "succeeded" ? (
    <div>
      <ProposalDetails
        record={record}
        voteSummary={voteSummary}
        onFetchTimestamps={onFetchTimestamps}
      />
    </div>
  ) : detailsStatus === "failed" ? (
    <Message kind="error">{detailsError}</Message>
  ) : (
    "Loading..."
  );
}

export default Details;

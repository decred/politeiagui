import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { records } from "@politeiagui/core/records";
import { ticketvoteSummaries } from "@politeiagui/ticketvote/summaries";
import { fetchProposalDetails, selectDetailsStatus } from "./detailsSlice";
import ProposalDetails from "../../components/Proposal/ProposalDetails";

function Details({ token }) {
  const dispatch = useDispatch();
  const record = useSelector((state) => records.selectByToken(state, token));
  const voteSummary = useSelector((state) =>
    ticketvoteSummaries.selectByToken(state, token)
  );
  const detailsStatus = useSelector(selectDetailsStatus);

  useEffect(() => {
    dispatch(fetchProposalDetails(token));
  }, [token, dispatch]);

  return detailsStatus === "succeeded" ? (
    <div>
      <ProposalDetails record={record} voteSummary={voteSummary} />
    </div>
  ) : (
    "Loading..."
  );
}

export default Details;

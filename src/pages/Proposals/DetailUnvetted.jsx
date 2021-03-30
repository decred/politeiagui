import React from "react";
import MultipleContentPage from "src/components/layout/MultipleContentPage";
import ProposalDetail from "src/containers/Proposal/Detail";
import { PROPOSAL_STATE_UNVETTED } from "src/constants";

const UnvettedProposalDetailPage = () => (
  <MultipleContentPage topBannerHeight={0}>
    {(props) => <ProposalDetail state={PROPOSAL_STATE_UNVETTED} {...props} />}
  </MultipleContentPage>
);

export default UnvettedProposalDetailPage;

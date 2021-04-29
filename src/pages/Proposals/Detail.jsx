import React from "react";
import MultipleContentPage from "src/components/layout/MultipleContentPage";
import ProposalDetail from "src/containers/Proposal/Detail";

const ProposalDetailPage = () => (
  <MultipleContentPage topBannerHeight={0}>
    {(props) => <ProposalDetail {...props} />}
  </MultipleContentPage>
);

export default ProposalDetailPage;

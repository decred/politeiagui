import React from "react";
import MultipleContentPage from "src/components/layout/MultipleContentPage";
import VettedProposals from "src/containers/Proposal/Vetted";

const VettedList = () => (
  <MultipleContentPage disableScrollToTop>
    {(props) => <VettedProposals {...props} />}
  </MultipleContentPage>
);

export default VettedList;

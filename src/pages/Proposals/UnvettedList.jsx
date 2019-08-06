import React from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";
import UnvettedProposals from "src/containers/Proposal/Unvetted";

const UnvettedList = () => {
  return (
    <MultipleContentPage disableScrollToTop>
      {props => <UnvettedProposals {...props} />}
    </MultipleContentPage>
  );
};

export default UnvettedList;

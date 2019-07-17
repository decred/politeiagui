import React from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";
import PublicProposals from "src/containers/Proposal/Public";

const PublicList = () => {
  return (
    <MultipleContentPage disableScrollToTop>
      {props => <PublicProposals {...props} />}
    </MultipleContentPage>
  );
};

export default PublicList;

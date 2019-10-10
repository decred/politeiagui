import React from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";
import ProposalDetail from "src/containers/Proposal/Detail";

const PublicList = () => {
  return (
    <MultipleContentPage topBannerHeight={0}>
      {props => {
        return <ProposalDetail {...props} />;
      }}
    </MultipleContentPage>
  );
};

export default PublicList;

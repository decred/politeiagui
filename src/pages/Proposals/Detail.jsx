import React, { useMemo } from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";
import ProposalDetail from "src/containers/Proposal/Detail";

const PublicList = () => {
  return (
    <MultipleContentPage topBannerHeight={90}>
      {props => {
        return useMemo(
          () => <ProposalDetail {...props} />,
          Object.values(props)
        );
      }}
    </MultipleContentPage>
  );
};

export default PublicList;

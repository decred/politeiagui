import React, { useMemo } from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";
import PublicProposals from "src/containers/Proposal/Public";

const PublicList = () => {
  return (
    <MultipleContentPage>
      {props => {
        return useMemo(
          () => <PublicProposals {...props} />,
          Object.values(props)
        );
      }}
    </MultipleContentPage>
  );
};

export default PublicList;

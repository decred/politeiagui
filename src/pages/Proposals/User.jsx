import React from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";
import ProposalsUser from "src/containers/Proposal/User";

const PageProposalsUser = () => {
  return (
    <MultipleContentPage>
      {props => <ProposalsUser {...props} />}
    </MultipleContentPage>
  );
};

export default PageProposalsUser;

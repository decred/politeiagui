import React from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";
import ProposalNewForm from "src/containers/Proposal/New";

const PageProposalsNew = () => {
  return (
    <MultipleContentPage>
      {({ TopBanner, PageDetails, Sidebar, Main }) => (
        <>
          <TopBanner>
            <PageDetails title="Create Proposal" />
          </TopBanner>
          <Sidebar />
          <Main>
            <ProposalNewForm />
          </Main>
        </>
      )}
    </MultipleContentPage>
  );
};

export default PageProposalsNew;

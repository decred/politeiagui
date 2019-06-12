import React from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";
import ProposalNewForm from "src/containers/Proposal/New";

const PageProposalsNew = () => {
  return (
    <MultipleContentPage>
      {({ TopBanner, PageDetails, SideBanner, Sidebar, Main, Title }) => (
        <>
          <TopBanner>
            <PageDetails>
              <Title>Create Proposal</Title>
            </PageDetails>
            <SideBanner />
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

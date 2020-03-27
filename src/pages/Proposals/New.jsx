import React from "react";
import MultipleContentPage from "src/components/layout/MultipleContentPage";
import ProposalNewForm from "src/containers/Proposal/New";

const PageProposalsNew = () => {
  return (
    <MultipleContentPage topBannerHeight={90}>
      {({ TopBanner, PageDetails, Main }) => (
        <>
          <TopBanner>
            <PageDetails title="Create Proposal" actionsContent={null} />
          </TopBanner>
          <Main fillScreen>
            <ProposalNewForm />
          </Main>
        </>
      )}
    </MultipleContentPage>
  );
};

export default PageProposalsNew;

import React from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";

const PageProposalsUser = () => {
  return (
    <MultipleContentPage>
      {({ TopBanner, PageDetails, Sidebar, Main }) => (
        <>
          <TopBanner>
            <PageDetails title="Your Proposals" />
          </TopBanner>
          <Sidebar>Sidebar</Sidebar>
          <Main>Main Content</Main>
        </>
      )}
    </MultipleContentPage>
  );
};

export default PageProposalsUser;

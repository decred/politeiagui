import React from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";

const PageProposalsUser = () => {
  return (
    <MultipleContentPage>
      {({ TopBanner, PageDetails, SideBanner, Sidebar, Main, Title }) => (
        <>
          <TopBanner>
            <PageDetails>
              <Title>User proposals</Title>
            </PageDetails>
            <SideBanner />
          </TopBanner>
          <Sidebar>Sidebar</Sidebar>
          <Main>Main Content</Main>
        </>
      )}
    </MultipleContentPage>
  );
};

export default PageProposalsUser;

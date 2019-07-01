import React from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";

const PageProposalsAdmin = () => {
  return (
    <MultipleContentPage>
      {({ TopBanner, PageDetails, Sidebar, Main }) => (
        <>
          <TopBanner>
            <PageDetails title="Admin" />
          </TopBanner>
          <Sidebar>Sidebar</Sidebar>
          <Main>Main Content</Main>
        </>
      )}
    </MultipleContentPage>
  );
};

export default PageProposalsAdmin;

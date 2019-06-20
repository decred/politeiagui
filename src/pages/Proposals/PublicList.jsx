import React from "react";
import MultipleContentPage from "src/componentsv2/layouts/MultipleContentPage";

const PublicList = () => {
  return (
    <MultipleContentPage>
      {({ TopBanner, PageDetails, SideBanner, Sidebar, Main, Title }) => (
        <>
          <TopBanner>
            <PageDetails>
              <Title>Public Proposals</Title>
            </PageDetails>
            <SideBanner />
          </TopBanner>
          <Sidebar />
          <Main>Main Content</Main>
        </>
      )}
    </MultipleContentPage>
  );
};

export default PublicList;

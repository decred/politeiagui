import React from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";

const PageInvoicesNew = () => {
  return (
    <MultipleContentPage>
      {({ TopBanner, PageDetails, SideBanner, Sidebar, Main, Title }) => (
        <>
          <TopBanner>
            <PageDetails>
              <Title>Create Invoice</Title>
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

export default PageInvoicesNew;

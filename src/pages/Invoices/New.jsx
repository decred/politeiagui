import React from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";

const PageInvoicesNew = () => {
  return (
    <MultipleContentPage>
      {({ TopBanner, PageDetails, Sidebar, Main }) => (
        <>
          <TopBanner>
            <PageDetails title="Create Invoice" />
          </TopBanner>
          <Sidebar />
          <Main>Main Content</Main>
        </>
      )}
    </MultipleContentPage>
  );
};

export default PageInvoicesNew;

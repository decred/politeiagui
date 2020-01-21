import React from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";
import InvoiceNewForm from "src/containers/Invoice/New";

const PageInvoicesNew = () => {
  return (
    <MultipleContentPage topBannerHeight={90}>
      {({ TopBanner, PageDetails, Main }) => (
        <>
          <TopBanner>
            <PageDetails title="Create Invoice" actionsContent={null} />
          </TopBanner>
          <Main fillScreen>
            <InvoiceNewForm />
          </Main>
        </>
      )}
    </MultipleContentPage>
  );
};

export default PageInvoicesNew;

import React from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";
import InvoiceDetail from "src/containers/Invoice/Detail";

const InvoiceDetailPage = () => {
  return (
    <MultipleContentPage topBannerHeight={0}>
      {props => {
        return <InvoiceDetail {...props} />;
      }}
    </MultipleContentPage>
  );
};

export default InvoiceDetailPage;

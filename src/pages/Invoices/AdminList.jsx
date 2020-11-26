import React from "react";
import MultipleContentPage from "src/components/layout/MultipleContentPage";
import ListAdminInvoices from "src/containers/Invoice/List/List";

const PageListAdminInvoices = () => (
  <MultipleContentPage disableScrollToTop topBannerHeight={160}>
    {(props) => <ListAdminInvoices {...props} />}
  </MultipleContentPage>
);

export default PageListAdminInvoices;

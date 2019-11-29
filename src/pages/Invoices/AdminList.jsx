import React from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";
import ListAdminInvoices from "src/containers/Invoice/Admin/List";

const PageListAdminInvoices = () => {
  return (
    <MultipleContentPage disableScrollToTop>
      {props => <ListAdminInvoices {...props} />}
    </MultipleContentPage>
  );
};

export default PageListAdminInvoices;

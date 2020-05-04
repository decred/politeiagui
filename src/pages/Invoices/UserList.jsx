import React from "react";
import MultipleContentPage from "src/components/layout/MultipleContentPage";
import ListUserInvoices from "src/containers/Invoice/User/List";

const PageListUserInvoices = () => {
  return (
    <MultipleContentPage disableScrollToTop>
      {(props) => <ListUserInvoices {...props} />}
    </MultipleContentPage>
  );
};

export default PageListUserInvoices;

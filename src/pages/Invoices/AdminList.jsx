import React from "react";
import { useMediaQuery } from "pi-ui";
import MultipleContentPage from "src/components/layout/MultipleContentPage";
import ListAdminInvoices from "src/containers/Invoice/Admin/List";

const PageListAdminInvoices = () => {
  const mobile = useMediaQuery("(max-width: 760px)");
  return (
    <MultipleContentPage
      disableScrollToTop
      topBannerHeight={mobile ? 160 : 140}
    >
      {props => <ListAdminInvoices {...props} />}
    </MultipleContentPage>
  );
};

export default PageListAdminInvoices;

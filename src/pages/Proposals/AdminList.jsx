import React from "react";
import MultipleContentPage from "src/components/layout/MultipleContentPage";
import AdminProposals from "src/containers/Proposal/Admin";

const AdminList = () => {
  return (
    <MultipleContentPage disableScrollToTop>
      {(props) => <AdminProposals {...props} />}
    </MultipleContentPage>
  );
};

export default AdminList;

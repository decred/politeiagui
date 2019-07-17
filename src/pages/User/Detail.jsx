import React from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";
import UserDetail from "src/containers/User/Detail";

const PageUserDetail = () => {
  return (
    <MultipleContentPage>
      {props => <UserDetail {...props} />}
    </MultipleContentPage>
  );
};

export default PageUserDetail;

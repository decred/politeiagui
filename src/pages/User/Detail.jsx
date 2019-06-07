import React, { useMemo } from "react";
import MultipleContentPage from "src/componentsv2/layouts/MultipleContentPage";
import UserDetail from "src/containers/User/Detail";

const PageUserDetail = () => {
  return (
    <MultipleContentPage>
      {props => {
        return useMemo(() => <UserDetail {...props} />, Object.values(props));
      }}
    </MultipleContentPage>
  );
};

export default PageUserDetail;

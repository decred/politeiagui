import React from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";
import Search from "src/containers/User/Search";

const PageUserSearch = () => {
  return (
    <MultipleContentPage topBannerHeight={220}>
      {props => <Search {...props} />}
    </MultipleContentPage>
  );
};

export default PageUserSearch;

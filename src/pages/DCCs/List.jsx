import React from "react";

import { useMediaQuery } from "pi-ui";
import MultipleContentPage from "src/components/layout/MultipleContentPage";
import ListDccs from "src/containers/DCC/List";

const DccList = () => {
  const mobile = useMediaQuery("(max-width: 760px)");
  return (
    <MultipleContentPage
      disableScrollToTop
      topBannerHeight={mobile ? 160 : 140}
    >
      {(props) => <ListDccs {...props} />}
    </MultipleContentPage>
  );
};

export default DccList;

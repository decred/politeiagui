import React from "react";
import MultipleContentPage from "src/components/layout/MultipleContentPage";
import DccDetail from "src/containers/DCC/Detail";

const DccDetailPage = () => {
  return (
    <MultipleContentPage topBannerHeight={0}>
      {props => {
        return <DccDetail {...props} />;
      }}
    </MultipleContentPage>
  );
};

export default DccDetailPage;

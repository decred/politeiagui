import React from "react";
import MultipleContentPage from "../../componentsv2/layout/MultipleContentPage";
import PayoutsList from "src/containers/Invoice/Payouts";

const PageGeneratePayoutsList = () => {
  return (
    <MultipleContentPage
      disableScrollToTop
      topBannerHeight={90}
    >
      {props => <PayoutsList {...props} />}
    </MultipleContentPage>
  );
};

export default PageGeneratePayoutsList;

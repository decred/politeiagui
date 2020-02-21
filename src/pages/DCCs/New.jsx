import React from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";
import DccNewForm from "src/containers/DCC/New";

const PageDccsNew = () => {
  return (
    <MultipleContentPage topBannerHeight={90}>
      {({ TopBanner, PageDetails, Main }) => (
        <>
          <TopBanner>
            <PageDetails title="Create DCC" actionsContent={null} />
          </TopBanner>
          <Main fillScreen>
            <DccNewForm />
          </Main>
        </>
      )}
    </MultipleContentPage>
  );
};

export default PageDccsNew;

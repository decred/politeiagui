import React from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";

const PageProposalsAdmin = () => {
  return (
    <MultipleContentPage>
      {({ TopBanner, PageDetails, Main }) => (
        <>
          <TopBanner>
            <PageDetails title="Admin" />
          </TopBanner>
          <Main fillScreen>Main Content</Main>
        </>
      )}
    </MultipleContentPage>
  );
};

export default PageProposalsAdmin;

import React from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";
import ProposalEdit from "src/containers/Proposal/Edit";

const PageProposalEdit = () => {
  return (
    <MultipleContentPage topBannerHeight={90}>
      {({ TopBanner, PageDetails, Sidebar, Main }) => (
        <>
          <TopBanner>
            <PageDetails
              headerClassName="no-margin-top"
              title="Edit Proposal"
            />
          </TopBanner>
          <Sidebar />
          <Main>
            <ProposalEdit />
          </Main>
        </>
      )}
    </MultipleContentPage>
  );
};

export default PageProposalEdit;

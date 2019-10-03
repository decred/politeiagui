import React from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";
import ProposalEdit from "src/containers/Proposal/Edit";
import styles from "./Proposals.module.css";

const PageProposalEdit = () => {
  return (
    <MultipleContentPage topBannerHeight={90}>
      {({ TopBanner, PageDetails, Main }) => (
        <>
          <TopBanner>
            <PageDetails title="Edit Proposal" />
          </TopBanner>
          <Main className={styles.customMain}>
            <ProposalEdit />
          </Main>
        </>
      )}
    </MultipleContentPage>
  );
};

export default PageProposalEdit;

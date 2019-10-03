import React from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";
import styles from "./Proposals.module.css";

const PageProposalsAdmin = () => {
  return (
    <MultipleContentPage>
      {({ TopBanner, PageDetails, Main }) => (
        <>
          <TopBanner>
            <PageDetails title="Admin" />
          </TopBanner>
          <Main className={styles.customMain}>Main Content</Main>
        </>
      )}
    </MultipleContentPage>
  );
};

export default PageProposalsAdmin;

import React from "react";
import MultipleContentPage from "src/componentsv2/layout/MultipleContentPage";
import ProposalDetail from "src/containers/Proposal/Detail";
import styles from "./Proposals.module.css";

const PublicList = () => {
  return (
    <MultipleContentPage topBannerHeight={82}>
      {props => {
        const { Main } = props;
        const MainWithClass = ({ children }) => <Main className={styles.customMain}>{children}</Main>;
        return <ProposalDetail {...props} Main={MainWithClass} />;
      }}
    </MultipleContentPage>
  );
};

export default PublicList;

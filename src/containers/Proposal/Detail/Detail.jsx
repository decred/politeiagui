import React from "react";
import { withRouter } from "react-router-dom";
import styles from "./Detail.module.css";
import { useProposal } from "./hooks";
import Proposal from "src/componentsv2/Proposal";

const ProposalDetail = ({ TopBanner, PageDetails, Sidebar, Main, match }) => {
  const { proposal, loading } = useProposal({ match });
  const { name } = proposal || {};
  return !!proposal && !loading ? (
    <>
      <TopBanner>
        <PageDetails
          title={"Proposal Details"}
          headerClassName="no-margin-top"
        />
      </TopBanner>
      <Sidebar />
      <Main className={styles.customMain}>
        <Proposal proposal={proposal} extended />
      </Main>
    </>
  ) : null;
};

export default withRouter(ProposalDetail);

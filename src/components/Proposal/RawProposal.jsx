import React from "react";
import get from "lodash/fp/get";
import { classNames } from "pi-ui";
import { getMarkdownContent } from "src/containers/Proposal/helpers";
import { useProposal } from "src/containers/Proposal/Detail/hooks";
import usePolicy from "src/hooks/api/usePolicy";
import styles from "./Proposal.module.css";

const RawProposal = ({ match }) => {
  const { policyTicketVote: { summariespagesize: proposalPageSize } } = usePolicy();
  const tokenFromUrl = get("params.token", match);
  const { proposal, loading, error } = useProposal(tokenFromUrl, proposalPageSize);
  const rawMarkdown = proposal ? getMarkdownContent(proposal.files) : null;
  return !loading && !error ? (
    <div>
      <pre className={classNames("markdown-body", styles.rawMarkdownPre)}>
        {rawMarkdown}
      </pre>
    </div>
  ) : null;
};

export default RawProposal;

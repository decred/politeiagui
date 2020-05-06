import React from "react";
import { Link, classNames } from "pi-ui";
import styles from "./ProposalForm.module.css";

const ProposalGuidelinesButton = ({ isDarkTheme }) => (
  <Link
    weight="semibold"
    target="_blank"
    rel="noopener noreferrer"
    className={classNames(
      styles.proposalGuidelinesButton,
      isDarkTheme && styles.darkButton
    )}
    href="https://docs.decred.org/governance/politeia/proposal-guidelines/">
    Proposal Guidelines
  </Link>
);

export default ProposalGuidelinesButton;

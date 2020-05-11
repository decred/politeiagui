import React from "react";
import PropTypes from "prop-types";
import { Text, classNames } from "pi-ui";
import styles from "./ProposalsList.module.css";
import ProposalItem from "./ProposalItem";

const ProposalsList = ({ data: { proposals, voteSummaries } }) => {
  return (
    <div className="margin-top-l">
      <Text
        className={classNames(styles.title, "margin-bottom-m")}
        color="primaryDark"
        weight="semibold">
        Submitted Proposals
      </Text>
      {proposals.map((proposal, index) => (
        <ProposalItem
          key={index}
          proposal={proposal}
          voteSummary={voteSummaries[proposals[index].censorshiprecord.token]}
        />
      ))}
    </div>
  );
};

ProposalsList.propTypes = {
  data: PropTypes.object.isRequired
};

export default ProposalsList;

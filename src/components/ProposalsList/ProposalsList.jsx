import React from "react";
import PropTypes from "prop-types";
import { Text, classNames, useTheme, getThemeProperty } from "pi-ui";
import styles from "./ProposalsList.module.css";
import { shortRecordToken } from "src/helpers";
import ProposalItem from "./ProposalItem";
import LoadingPlaceholders from "src/components/LoadingPlaceholders";
import ContentLoader from "react-content-loader";

const Placeholder = () => {
  const { theme } = useTheme();
  const primaryColor = getThemeProperty(theme, "card-background");
  const secondaryColor = getThemeProperty(theme, "dimmed-card-background");
  return (
    <ContentLoader
      height={220}
      width={800}
      speed={2}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
    >
      <rect x="0" y="30" width="800" height="200" />
    </ContentLoader>
  );
};

const ProposalsList = ({
  data: { proposals, voteSummaries, proposalSummaries }
}) => {
  const hasSubmissions = proposals.length > 0;
  return (
    <div className="margin-top-l">
      <Text
        className={classNames(styles.title, "margin-bottom-m")}
        color="primaryDark"
        weight="semibold"
      >
        Submitted Proposals
      </Text>
      {hasSubmissions ? (
        proposals
          .sort((a, b) => a.status - b.status)
          .map((proposal, index) => (
            <ProposalItem
              key={index}
              proposal={proposal}
              voteSummary={
                voteSummaries[
                  shortRecordToken(proposals[index]?.censorshiprecord.token)
                ]
              }
              proposalSummary={
                proposalSummaries[
                  shortRecordToken(proposals[index]?.censorshiprecord.token)
                ]
              }
            />
          ))
      ) : (
        <LoadingPlaceholders numberOfItems={1} placeholder={Placeholder} />
      )}
    </div>
  );
};

ProposalsList.propTypes = {
  data: PropTypes.object.isRequired
};

export default ProposalsList;

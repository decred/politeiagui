import React from "react";
import PropTypes from "prop-types";
import { Text, classNames, useTheme, getThemeProperty } from "pi-ui";
import styles from "./ProposalsList.module.css";
import ProposalItem from "./ProposalItem";
import LoadingPlaceholders from "src/components/LoadingPlaceholders";
import ContentLoader from "react-content-loader";

const Placeholder = () => {
  const { theme } = useTheme();
  const primaryColor = getThemeProperty(theme, "color-gray-lightest");
  const secondaryColor = getThemeProperty(theme, "color-gray-lighter");
  return (
    <ContentLoader
      height={420}
      width={800}
      speed={2}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}>
      <rect x="0" y="30" width="800" height="200" />
    </ContentLoader>
  );
};

const ProposalsList = ({ data: { proposals, voteSummaries } }) => {
  const hasSubmissions = proposals.length > 0;
  return (
    <div className="margin-top-l">
      <Text
        className={classNames(styles.title, "margin-bottom-m")}
        color="primaryDark"
        weight="semibold">
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
                voteSummaries[proposals[index].censorshiprecord.token]
              }
            />
          ))
      ) : (
        <LoadingPlaceholders numberOfItems={2} placeholder={Placeholder} />
      )}
    </div>
  );
};

ProposalsList.propTypes = {
  data: PropTypes.object.isRequired
};

export default ProposalsList;

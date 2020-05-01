import React from "react";
import ContentLoader from "react-content-loader";

const ProposalFormLoader = () => (
  <ContentLoader
    height={420}
    width={800}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb">
    <rect x="0" y="30" width="800" height="200" />
    <rect x="630" y="250" width="170" height="50" />
  </ContentLoader>
);

export default ProposalFormLoader;

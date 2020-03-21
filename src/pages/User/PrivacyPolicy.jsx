import React from "react";
import SingleContentPage from "src/components/layout/SingleContentPage";
import StaticMarkdown from "src/components/StaticMarkdown";
import { useConfig } from "src/containers/Config";

const PageUserPrivacyPolicy = () => {
  const { privacyPolicyContent } = useConfig();
  return (
    <SingleContentPage contentWidth="widen">
      <StaticMarkdown contentName={privacyPolicyContent} />
    </SingleContentPage>
  );
};

export default PageUserPrivacyPolicy;

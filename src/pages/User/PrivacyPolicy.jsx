import React from "react";
import SingleContentPage from "src/componentsv2/layouts/SingleContentPage";
import StaticMarkdown from "src/componentsv2/StaticMarkdown";
import { useConfig } from "src/Config";

const PageUserPrivacyPolicy = () => {
  const { privacyPolicyContent } = useConfig();
  return (
    <SingleContentPage contentWidth="widen">
      <StaticMarkdown contentName={privacyPolicyContent} />
    </SingleContentPage>
  );
};

export default PageUserPrivacyPolicy;

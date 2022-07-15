import React from "react";
import { Modal } from "pi-ui";
import { useConfig } from "src/containers/Config";
import Link from "src/components/Link";
import StaticMarkdown from "./StaticMarkdown";

const ModalPrivacyPolicy = (props) => {
  const { privacyPolicyContent } = useConfig();
  return (
    <Modal
      style={{ maxWidth: "70rem" }}
      {...props}
      iconType="info"
      iconSize="lg"
    >
      <StaticMarkdown contentName={privacyPolicyContent} />
      <div className="justify-right">
        <Link to="/user/privacy-policy" className="margin-top-m">
          Privacy Policy Permalink
        </Link>
      </div>
    </Modal>
  );
};

export default ModalPrivacyPolicy;

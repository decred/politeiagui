import React from "react";
import { Card } from "pi-ui";
import { MarkdownRenderer } from "@politeiagui/common-ui";
import policy from "../../assets/copies/privacy-policy.md";

function PrivacyPolicy() {
  return (
    <Card paddingSize="small" data-testid="privacy-policy">
      <MarkdownRenderer body={policy} />
    </Card>
  );
}

export default PrivacyPolicy;

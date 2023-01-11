import React from "react";
import { Card } from "pi-ui";
import { MarkdownRenderer } from "@politeiagui/common-ui";
import emailVerified from "../../assets/copies/email-verified.md";

function EmailVerified({ className }) {
  return (
    <Card
      paddingSize="small"
      className={className}
      data-testid="email-verified"
    >
      <MarkdownRenderer body={emailVerified} />
    </Card>
  );
}

export default EmailVerified;

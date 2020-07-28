import React from "react";
import { P, Message } from "pi-ui";

export const PoliteiaQuiescedMessage = () => (
  <Message className="margin-bottom-m" kind="error">
    <P>
      Politeia is currently operating in readonly mode, please try again later
    </P>
  </Message>
);

export default PoliteiaQuiescedMessage;

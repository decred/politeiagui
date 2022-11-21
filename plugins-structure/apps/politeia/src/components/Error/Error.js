import React from "react";
import { Message, StaticContainer } from "pi-ui";

function Error({ error }) {
  return (
    error && (
      <StaticContainer style={{ marginTop: "3rem" }}>
        <Message kind="error" data-testid="politeia-error-message">
          {error.toString()}
        </Message>
      </StaticContainer>
    )
  );
}

export default Error;

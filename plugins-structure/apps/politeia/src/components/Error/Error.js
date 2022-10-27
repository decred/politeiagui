import React from "react";
import { Message, StaticContainer } from "pi-ui";

function Error({ error }) {
  return (
    error && (
      <StaticContainer style={{ marginTop: "3rem" }}>
        <Message kind="error">{error.toString()}</Message>
      </StaticContainer>
    )
  );
}

export default Error;

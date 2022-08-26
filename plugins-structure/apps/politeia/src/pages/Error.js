import React from "react";
import { Message, StaticContainer } from "pi-ui";
import { createRouteView } from "../utils/createRouteView";

const ErrorPage = ({ error }) => {
  return (
    error && (
      <StaticContainer style={{ marginTop: "3rem" }}>
        <Message kind="error">{error.toString()}</Message>
      </StaticContainer>
    )
  );
};

const ErrorView = createRouteView(ErrorPage);

export default ErrorView;

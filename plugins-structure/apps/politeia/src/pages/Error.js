import React from "react";
import { createRouteView } from "../utils/createRouteView";
import { Error } from "../components";

function ErrorPage({ error }) {
  return <Error error={error} />;
}

const ErrorView = createRouteView(ErrorPage);

export default ErrorView;

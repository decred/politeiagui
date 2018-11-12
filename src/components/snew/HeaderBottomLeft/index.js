import React from "react";
import { autobind } from "core-decorators";
import Page from "./Page";
import headerConnector from "../../../connectors/header";

class HeaderBottomLeft extends React.Component {
  render() {
    return <Page />;
  }
}

autobind(HeaderBottomLeft);

export default headerConnector(HeaderBottomLeft);

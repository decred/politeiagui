import React from "react";
import {autobind} from "core-decorators";
import Page from "./Page";
import headerConnector from "../../../connectors/header";

class HeaderBottomLeft extends React.Component {

  componentWillMount() {
    const {hasPaid, paywallAddress, paywallAmount, paywallTxNotBefore} = this.props;
    if(!paywallAddress)
      return;
    if (hasPaid === false)
      this.props.verifyUserPayment(paywallAddress, paywallAmount, paywallTxNotBefore);
  }

  render() {
    return (
      <Page />
    );
  }

}

autobind(HeaderBottomLeft);

export default headerConnector(HeaderBottomLeft);

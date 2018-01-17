import React from "react";
import {autobind} from "core-decorators";
import Page from "./Page";
import headerConnector from "../../../connectors/header";

class HeaderBottomLeft extends React.Component {

  componentWillMount() {
    const {hasPaid, paywallAddress, paywallAmount} = this.props;
    if(!paywallAddress)
      return;
    if (hasPaid === false)
      this.props.getPaymentsByAddress(paywallAddress, paywallAmount);
  }

  render() {
    return (
      <Page />
    );
  }

}

autobind(HeaderBottomLeft);

export default headerConnector(HeaderBottomLeft);

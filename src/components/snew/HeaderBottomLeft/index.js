import React from "react";
import {autobind} from "core-decorators";
import Page from "./Page";
import headerConnector from "../../../connectors/header";

class HeaderBottomLeft extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const {hasPaid, paywallAddress, paywallAmount} = this.props;
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

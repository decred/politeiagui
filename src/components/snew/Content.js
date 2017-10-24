import React, { Component } from "react";
import { Content } from "snew-classic-ui";
import { proposalToT3 } from "../../lib/snew";

export const CustomContent = ({ listings, proposals, isLoading, ...props }) => (
  <Content {...{
    ...props,
    isLoading,
    listings: listings || [
      {
        allChildren: proposals.map(proposalToT3)
      }
    ]
  }} />
);

class Loader extends Component {
  componentDidMount() {
    console.log("props", this.props);
    this.props.onFetchData && this.props.onFetchData();
  }

  render() {
    return <CustomContent {...this.props} />;
  }
}

export default Loader;

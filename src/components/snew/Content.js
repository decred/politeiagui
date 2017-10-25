import React, { Component } from "react";
import { Content } from "snew-classic-ui";
import { proposalToT3 } from "../../lib/snew";
import ReactBody from "react-body";
import Loading from "./Loading";

export const CustomContent = ({ listings, proposals, isLoading, ...props }) => [
  <ReactBody className="listing-page" key="body" />,
  <Content {...{
    ...props,
    key: "content",
    Loading,
    isLoading,
    listings: listings || [
      {
        allChildren: proposals.map(proposalToT3)
      }
    ]
  }} />
];

class Loader extends Component {
  componentDidMount() {
    this.props.onFetchData && this.props.onFetchData();
  }

  render() {
    return <CustomContent {...this.props} />;
  }
}

export default Loader;

import React, { Component } from "react";
import { Content } from "snew-classic-ui";
import { proposalToT3 } from "../../lib/snew";
import ReactBody from "react-body";
import PageLoadingIcon from "./PageLoadingIcon";

export const CustomContent = ({
  bodyClassName="listing-page",
  listings,
  proposals,
  isLoading,
  ...props
}) => {
  let content = isLoading ? (
    <PageLoadingIcon key="content" />
  ) : (
    <Content {...{
      ...props,
      key: "content",
      listings: listings || [
        {
          allChildren: proposals.map(proposalToT3)
        }
      ]
    }} />
  );

  return [
    <ReactBody className={bodyClassName} key="body" />,
    content
  ];
};

class Loader extends Component {
  componentDidMount() {
    this.props.onFetchData && this.props.onFetchData();
  }

  render() {
    return <CustomContent {...this.props} />;
  }
}

export default Loader;

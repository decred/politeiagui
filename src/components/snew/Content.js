import React, { Component } from "react";
import { Content } from "snew-classic-ui";
import { proposalToT3 } from "../../lib/snew";
import ReactBody from "react-body";
import PageLoadingIcon from "./PageLoadingIcon";
import Message from "../Message";

export const CustomContent = ({
  bodyClassName="listing-page",
  listings,
  proposals,
  isLoading,
  error,
  ...props
}) => {
  let content = error ? (
    <div className="content" role="main">
      <Message
        type="error"
        header="Error loading proposals"
        body={error} />
    </div>
  ) : isLoading ? (
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

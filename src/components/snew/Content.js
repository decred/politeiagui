import React, { Component } from "react";
import { Content } from "snew-classic-ui";
import { proposalToT3 } from "../../lib/snew";
import ReactBody from "react-body";
import PageLoadingIcon from "./PageLoadingIcon";
import Message from "../Message";
import ProposalFilter from "../ProposalFilter";

export const CustomContent = ({
  bodyClassName="listing-page",
  listings,
  proposals,
  isLoading,
  error,
  header,
  onChangeFilter,
  filterValue,
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
  ) : (listings && listings.length > 0) || proposals.length > 0 ? (
    [
      <h1 style={{margin: "16px 352px 0 24px"}}>
        {header}
      </h1>,
      <ProposalFilter
        header={header}
        handleChangeFilterValue={onChangeFilter}
        filterValue={filterValue}
      />,
      <Content {...{
        ...props,
        key: "content",
        listings: listings || [
          {
            allChildren:
            proposals.filter(
              proposal =>
                !filterValue || proposal.status === filterValue
            )
              .map(proposalToT3)
          }
        ]
      }} />
    ]
  ) : (
    <h1 style={{ margin: "300px auto 0 auto", textAlign: "center" }}>
      There are no proposals yet
    </h1>
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

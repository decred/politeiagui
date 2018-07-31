import React, { Component } from "react";
import { Content } from "snew-classic-ui";
import { formatProposalData } from "../../lib/snew";
import ReactBody from "react-body";
import PageLoadingIcon from "./PageLoadingIcon";
import Message from "../Message";
import ProposalFilter from "../ProposalFilter";
import ThingLink from "../../connectors/thingLink";

export const CustomContent = ({
  bodyClassName="listing-page",
  listings,
  proposals,
  proposalCounts,
  emptyProposalsMessage = "There are no proposals yet",
  isLoading,
  error,
  header,
  onChangeFilter,
  filterValue,
  activeVotes,
  ...props
}) => {
  let content = error ? (
    <Message
      type="error"
      header="Error loading proposals"
      body={error} />
  ) : isLoading ? (
    <PageLoadingIcon key="content" />
  ) : (
    <div>
      {header &&
        <h1 className="proposals-listing-header">
          {header}
        </h1>
      }
      <ProposalFilter
        header={header}
        handleChangeFilterValue={onChangeFilter}
        filterValue={filterValue}
        proposalCounts={proposalCounts}
      />
      {
        (listings && listings.length > 0) || proposals.length > 0 ? (
          <Content {...{
            ...props,
            key: "content",
            lastBlockHeight: props.lastBlockHeight,
            listings: listings || [
              {
                allChildren:
                proposals.map((proposal, idx) => formatProposalData(proposal, idx, activeVotes))
              }
            ]
          }} />
        ) : (
          <h1 style={{ textAlign: "center", paddingTop: "125px", color: "#777" }}>
            {emptyProposalsMessage}
          </h1>
        )
      }
    </div>
  );

  return [
    <ReactBody className={bodyClassName} key="body" />,
    <div className="content" role="main" key="content">
      {content}
    </div>
  ];
};

class Loader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetched: false,
    };
  }

  componentDidMount() {
    if(this.props.isProposalStatusApproved){
      this.props.onChangeProposalStatusApproved(false);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isFetched } = this.state;
    if (isFetched)
      return;
    const { csrf } = nextProps;
    if (csrf) {
      this.setState({ isFetched: true });
      this.props.onFetchProposalsVoteStatus && this.props.onFetchProposalsVoteStatus();
      this.props.onFetchData && this.props.onFetchData();
    }
  }

  render() {
    return <CustomContent {...this.props} />;
  }
}

export default ThingLink(Loader);

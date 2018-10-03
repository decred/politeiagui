import React, { Component } from "react";
import { Content } from "snew-classic-ui";
import { formatProposalData } from "../../lib/snew";
import ReactBody from "react-body";
import PageLoadingIcon from "./PageLoadingIcon";
import Message from "../Message";
import ProposalFilter from "../ProposalFilter";
import thingLinkConnector from "../../connectors/thingLink";

export const CustomContent = ({
  bodyClassName="listing-page",
  listings,
  proposals,
  proposalCounts,
  emptyProposalsMessage = "There are no proposals yet",
  isLoading,
  error,
  userid,
  header,
  lastLoadedProposal,
  onChangeFilter,
  filterValue,
  activeVotes,
  onFetchData,
  onFetchUserProposals,
  count,
  ...props
}) => {
  const showList = (listings && listings.length > 0)||
    proposals.length > 0 ||
    proposalCounts[filterValue] !== 0;
  const showLoadMore = proposals &&
    ((count && count > proposals.length) ||
    (proposalCounts && proposalCounts[filterValue] > proposals.length));
  const content = error ? (
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
        showList ? (
          <React.Fragment>
            <Content {...{
              ...props,
              key: "content",
              lastBlockHeight: props.lastBlockHeight,
              listings: listings || [
                {
                  allChildren:
                  proposals ? proposals.map((proposal, idx) => formatProposalData(proposal, idx, activeVotes)) : []
                }
              ]
            }} />
            {
              showLoadMore &&
              (<div style={{ width: "100%", maxWidth: "1000px", textAlign: "center" }}>
                <button
                  style={{ marginTop: "15px" }}
                  className="c-btn c-btn-primary"
                  onClick={() => onFetchData ?
                    onFetchData(lastLoadedProposal ? lastLoadedProposal.censorshiprecord.token : null)
                    :
                    onFetchUserProposals(userid, lastLoadedProposal ? lastLoadedProposal.censorshiprecord.token : null)
                  }>
                  Load More
                </button>
              </div>)
            }
          </React.Fragment>
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
      isFetched: false
    };
  }

  componentDidMount() {
    const { getLastBlockHeight } = this.props;
    getLastBlockHeight && getLastBlockHeight();
    if(this.props.isProposalStatusApproved){
      this.props.onChangeProposalStatusApproved(false);
    }
  }

  componentDidUpdate() {
    const { csrf } = this.props;
    const { isFetched } = this.state;
    if (isFetched)
      return;
    else if (csrf) {
      this.setState({ isFetched: true });
      this.props.onFetchProposalsVoteStatus && this.props.onFetchProposalsVoteStatus();
      this.props.onFetchData && this.props.onFetchData();
      this.props.onFetchStatus && this.props.onFetchStatus();
    }
  }

  render() {
    return <CustomContent {...this.props} />;
  }
}

export default thingLinkConnector(Loader);

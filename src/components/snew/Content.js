import React, { Component } from "react";
import { Content } from "snew-classic-ui";
import { formatProposalData } from "../../lib/snew";
import Link from "./Link";
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
  showLookUp,
  ...props
}) => {
  const showList = (listings && listings.length > 0) ||
    (proposals && proposals.length > 0) ||
    (proposalCounts && filterValue >= 0 && proposalCounts[filterValue]) !== 0;
  const showLoadMore = proposals &&
    ((count && count > proposals.length) ||
    (proposalCounts && filterValue >= 0 && proposalCounts[filterValue] > proposals.length));
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
        <div style={showLookUp ? { display: "flex", justifyContent: "space-between", alignItems: "center" } : {}}>
          <h1 className="proposals-listing-header">
            {header}
          </h1>
          {showLookUp &&
            <Link
              style={{ marginRight: "24px" }}
              href="/admin/users"
              onClick={() => null}>
              <i className="fa fa-search right-margin-5" />
              Search users
            </Link>
          }
        </div>
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
    if(this.props.isProposalStatusApproved){
      this.props.onChangeProposalStatusApproved(false);
    }
  }

  componentDidUpdate() {
    const { csrf } = this.props;
    const { isFetched } = this.state;
    const { getLastBlockHeight } = this.props;
    if (isFetched)
      return;
    else if (csrf) {
      this.setState({ isFetched: true });
      this.props.onFetchData && this.props.onFetchData();
      this.props.onFetchStatus && this.props.onFetchStatus();
      this.props.onFetchProposalsVoteStatus && this.props.onFetchProposalsVoteStatus();
      getLastBlockHeight && getLastBlockHeight();
    }
  }

  render() {
    return <CustomContent {...this.props} />;
  }
}

export default thingLinkConnector(Loader);

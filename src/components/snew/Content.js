import React, { Component } from "react";
import { Content } from "snew-classic-ui";
import { formatProposalData, formatInvoiceData } from "../../lib/snew";
import Link from "./Link";
import ReactBody from "react-body";
import PageLoadingIcon from "./PageLoadingIcon";
import Message from "../Message";
import ProposalFilter from "../ProposalFilter";
import InvoiceFilter from "../InvoiceFilter";
import DateFilter from "../DateFilter";
import thingLinkConnector from "../../connectors/thingLink";

export const CustomContent = ({
  bodyClassName = "listing-page",
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
  commentid,
  comments,
  isCMS,
  invoices,
  invoiceCounts,
  onChangeDateFilter,
  onResetDateFilter,
  monthFilterValue,
  yearFilterValue,
  invoiceComments,
  ...props
}) => {
  const invalidProposalComment =
    !isLoading &&
    (commentid && comments && !comments.find(c => c.commentid === commentid));
  const invalidInvoiceComment =
    !isLoading &&
    (commentid &&
      invoiceComments &&
      !invoiceComments.find(c => c.commentid === commentid));
  const showList =
    (listings && listings.length > 0) ||
    (proposals && proposals.length > 0) ||
    (invoices && invoices.length > 0) ||
    (proposalCounts && filterValue >= 0 && proposalCounts[filterValue]) !== 0;
  const showLoadMore =
    proposals &&
    ((count && count > proposals.length) ||
      (proposalCounts &&
        filterValue >= 0 &&
        proposalCounts[filterValue] > proposals.length));
  const content = error ? (
    <Message type="error" header="Error loading proposals" body={error} />
  ) : isLoading ? (
    <PageLoadingIcon key="content" />
  ) : invalidProposalComment && invalidInvoiceComment ? (
    <Message
      type="error"
      header="Comment not found"
      body="Could not find comment"
    />
  ) : (
    <div>
      {header && (
        <div
          style={
            showLookUp
              ? {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }
              : {}
          }
        >
          <h1 className="content-title">{header}</h1>
          {showLookUp && (
            <div>
              {isCMS && (
                <>
                  <Link
                    style={{ marginRight: "24px" }}
                    href="/admin/payouts"
                    onClick={() => null}
                  >
                    Generate payouts
                  </Link>
                  <Link
                    style={{ marginRight: "24px" }}
                    href="/admin/invite"
                    onClick={() => null}
                  >
                    Invite new contractor
                  </Link>
                </>
              )}
              <Link
                style={{ marginRight: "24px" }}
                href="/admin/users"
                onClick={() => null}
              >
                <i className="fa fa-search right-margin-5" />
                Search users
              </Link>
            </div>
          )}
        </div>
      )}
      {isCMS ? (
        <React.Fragment>
          <InvoiceFilter
            header={header}
            handleChangeFilterValue={onChangeFilter}
            filterValue={filterValue}
            invoiceCounts={invoiceCounts}
          />
          <DateFilter
            header={header}
            monthFilterValue={monthFilterValue}
            yearFilterValue={yearFilterValue}
            handleChangeDateFilter={onChangeDateFilter}
            handleResetDateFilter={onResetDateFilter}
          />
        </React.Fragment>
      ) : (
        <ProposalFilter
          header={header}
          handleChangeFilterValue={onChangeFilter}
          filterValue={filterValue}
          proposalCounts={proposalCounts}
        />
      )}
      {showList ? (
        !isCMS ? (
          <React.Fragment>
            <Content
              {...{
                ...props,
                highlightcomment: commentid,
                key: "content",
                lastBlockHeight: props.lastBlockHeight,
                listings: listings || [
                  {
                    allChildren: proposals
                      ? proposals.map((proposal, idx) =>
                          formatProposalData(proposal, idx, activeVotes)
                        )
                      : []
                  }
                ]
              }}
            />
            {showLoadMore && (
              <div
                style={{
                  width: "100%",
                  maxWidth: "1000px",
                  textAlign: "center"
                }}
              >
                <button
                  style={{ marginTop: "15px" }}
                  className="c-btn c-btn-primary"
                  onClick={() =>
                    onFetchData
                      ? onFetchData(
                          lastLoadedProposal
                            ? lastLoadedProposal.censorshiprecord.token
                            : null
                        )
                      : onFetchUserProposals(
                          userid,
                          lastLoadedProposal
                            ? lastLoadedProposal.censorshiprecord.token
                            : null
                        )
                  }
                >
                  Load More
                </button>
              </div>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Content
              {...{
                ...props,
                highlightcomment: commentid,
                key: "content",
                lastBlockHeight: props.lastBlockHeight,
                listings: listings || [
                  {
                    allChildren: invoices
                      ? invoices.map((invoice, idx) =>
                          formatInvoiceData(invoice, idx)
                        )
                      : []
                  }
                ]
              }}
            />
          </React.Fragment>
        )
      ) : (
        <h1 style={{ textAlign: "center", paddingTop: "125px", color: "#777" }}>
          {emptyProposalsMessage}
        </h1>
      )}
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
    if (this.props.isProposalStatusApproved) {
      this.props.onChangeProposalStatusApproved(false);
    }
  }

  componentDidUpdate() {
    const { csrf } = this.props;
    const { isFetched } = this.state;
    const { getLastBlockHeight } = this.props;
    if (isFetched) return;
    else if (csrf) {
      this.setState({ isFetched: true });
      this.props.onFetchData && this.props.onFetchData();
      this.props.onFetchStatus && this.props.onFetchStatus();
      !this.props.isCMS &&
        ((this.props.onFetchProposalsVoteStatus &&
          this.props.onFetchProposalsVoteStatus()) ||
          this.props.onFetchProposalVoteStatus) &&
        getLastBlockHeight &&
        getLastBlockHeight();
    }
  }

  render() {
    return <CustomContent {...this.props} />;
  }
}

export default thingLinkConnector(Loader);

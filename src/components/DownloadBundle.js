import React, { Component } from "react";
import proposalDownloadConnector from "../connectors/proposalDownload";
import fileDownload from "js-file-download";
import { commentsToT1 } from "../lib/snew";

class DownloadBundle extends Component {
  constructor(props) {
    super(props);
    this.handleDownloadProposal = this.handleDownloadProposal.bind(this);
    this.handleDownloadComment = this.handleDownloadComment.bind(this);
  }

  handleDownloadProposal() {
    const { proposal, serverPubkey } = this.props;
    const bundle = proposal;
    bundle.serverPubkey = serverPubkey;
    const data = JSON.stringify(bundle, null, 2);
    fileDownload(data, `${proposal.censorshiprecord.token}.json`);
  }

  handleDownloadComment() {
    const { proposalComments, proposal } = this.props;
    const data = JSON.stringify(commentsToT1(proposalComments), null, 2);
    fileDownload(data, `${proposal.censorshiprecord.token}-comments.json`);
  }

  render() {
    const t = this.props.type;

    return t === "proposal" ? (
      <span className="linkish" onClick={this.handleDownloadProposal}>
        {this.props.message || "Download Proposal Bundle"}
      </span>
    ) : t === "comments" ? (
      <span className="linkish" onClick={this.handleDownloadComment}>
        {this.props.message || "Download Comments Bundle"}
      </span>
    ) : null;
  }
}

export default proposalDownloadConnector(DownloadBundle);

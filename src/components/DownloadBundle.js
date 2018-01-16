import React, { Component } from "react";
import proposalDownloadConnector from "../connectors/proposalDownload";
import fileDownload from "js-file-download";

class DownloadBundle extends Component {
  constructor(props) {
    super(props);
    this.handleDownloadClick = this.handleDownloadClick.bind(this);
  }

  handleDownloadClick() {
    const { proposal, serverPubkey } = this.props;
    const bundle = proposal;
    bundle.serverPubkey = serverPubkey;
    const data = JSON.stringify(bundle, null, 2);
    fileDownload(data, `${proposal.censorshiprecord.token}.json`);
  }

  render() {
    return (
      <a style={{ cursor: "pointer" }} onClick={this.handleDownloadClick}>
        {this.props.message || "Download Proposal Bundle"}
      </a>
    );
  }
}

export default proposalDownloadConnector(DownloadBundle);

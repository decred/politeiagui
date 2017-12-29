import React, { Component } from "react";
import proposalDownloadConnector from "../connectors/proposalDownload";
import fileDownload from "js-file-download";

class DownloadBundle extends Component {
  constructor(props) {
    super(props);
    this.handleDownloadClick = this.handleDownloadClick.bind(this);
  }

  handleDownloadClick() {
    const { proposal, serverIdentity } = this.props;
    const bundle = proposal;
    bundle.serverIdentity = serverIdentity;
    const data = JSON.stringify(bundle, null, 2);
    fileDownload(data, `${proposal.censorshiprecord.token}.json`);
  }

  render() {
    return (
      <div style={{ marginTop: "15px" }}>
        <a style={{ cursor: "pointer" }} onClick={this.handleDownloadClick}>
          Download Proposal Bundle
        </a>
      </div>
    );
  }
}

export default proposalDownloadConnector(DownloadBundle);

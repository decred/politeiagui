import React, { Component } from "react";
import userConnector from "../connectors/user";
import FileDownloadLink from "./FileDownloadLink";
import { IMPORT_IDENTITY_MODAL } from "./Modal/modalTypes";
import * as pki from "../lib/pki";

class PrivateKeyDownloadManager extends Component {
  componentDidMount() {
    this.fetchKeys().then(keyData => {
      if (!this.unmounting) {
        this.setState({ keyData });
      }
    });
  }
  componentWillUnmount() {
    this.unmounting = true;
  }

  render() {
    return (
      <div className="private-key-identity clearfloat">
        {this.state && this.state.keyData && !this.props.keyMismatch && (
          <FileDownloadLink
            filename="politeia-pki.json"
            mime="application/json;charset=utf-8"
            data={this.state.keyData}
          >
            <button>Download Identity</button>
          </FileDownloadLink>
        )}
        <button
          className="ReactFileReader"
          onClick={() => this.props.openModal(IMPORT_IDENTITY_MODAL)}
        >
          Import Identity
        </button>
      </div>
    );
  }

  fetchKeys() {
    return pki
      .getKeys(this.props.loggedInAsEmail)
      .then(keys => JSON.stringify(keys, null, 2));
  }
}

export default userConnector(PrivateKeyDownloadManager);

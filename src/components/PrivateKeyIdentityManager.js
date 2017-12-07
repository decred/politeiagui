import React, { Component } from "react";
import ReactFileReader from "react-file-reader";
import FileDownloadLink from "./FileDownloadLink";
import * as pki from "../lib/pki";

class PrivateKeyIdentityManager extends Component {
  componentDidMount() {
    this.fetchKeys().then(keyData => this.setState({ keyData }));
  }

  render() {
    return (
      <div className="private-key-identity">
        {this.state && this.state.keyData && (
          <FileDownloadLink
            filename="politeia-pki.json"
            mime="application/json;charset=utf-8"
            data={this.state.keyData}
          >
            <button>Save Private Key</button>
          </FileDownloadLink>
        )}
        <ReactFileReader
          base64
          handleFiles={this.onSelectFiles.bind(this)}
          multipleFiles={false}
          fileTypes="json"
        >
          <button>Import Private Key</button>
        </ReactFileReader>
      </div>
    );
  }

  fetchKeys() {
    return pki.getKeys().then(keys => JSON.stringify(keys, null, 2));
  }

  onSelectFiles({ base64 }) {
    try {
      const data = atob(base64.split(",").pop());
      const json = JSON.parse(data);
      if (!json || !json.publicKey || !json.secretKey) throw "Invalid keyfile";
      pki.importKeys(json)
        .then(() => alert("Successfully loaded Private Key Identity"))
        .catch(e => {
          console.error(e.stack);
          alert("Error importing keyfile");
        });
    } catch(e) {
      console.error(e.stack);
      alert("This is not a valid keyfile");
    }
  }
}

export default PrivateKeyIdentityManager;

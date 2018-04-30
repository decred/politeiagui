import React, { Component } from "react";
import ReactFileReader from "react-file-reader";
import FileDownloadLink from "./FileDownloadLink";
import * as pki from "../lib/pki";

class PrivateKeyIdentityManager extends Component {

  componentDidMount() {
    this.fetchKeys().then(keyData => {
      if(!this.unmounting) {
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
        {this.state && this.state.keyData && (
          <FileDownloadLink
            filename="politeia-pki.json"
            mime="application/json;charset=utf-8"
            data={this.state.keyData}
          >
            <button>Download Identity</button>
          </FileDownloadLink>
        )}
        <ReactFileReader
          base64
          handleFiles={this.onSelectFiles.bind(this)}
          multipleFiles={false}
          fileTypes="json"
        >
          <button>Import Identity</button>
        </ReactFileReader>
      </div>
    );
  }

  fetchKeys() {
    return pki.getKeys(this.props.loggedInAs).then(keys => JSON.stringify(keys, null, 2));
  }

  onSelectFiles({ base64 }) {
    try {
      const data = atob(base64.split(",").pop());
      const json = JSON.parse(data);
      if (!json || !json.publicKey || !json.secretKey) throw new Error("Invalid identity file");
      pki.importKeys(this.props.loggedInAs, json)
        .then(() => alert("Successfully loaded identity"))
        .catch(e => {
          console.error(e.stack);
          alert("Error importing identity file");
        });
    } catch(e) {
      console.error(e.stack);
      alert("This is not a valid identity file");
    }
  }
}

export default PrivateKeyIdentityManager;

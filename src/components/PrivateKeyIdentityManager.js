import React, { Component } from "react";
import ReactFileReader from "react-file-reader";
import FileDownloadLink from "./FileDownloadLink";
import * as pki from "../lib/pki";

// Import key errors
const PUBLIC_KEY_MISMATCH = "The provided public key doesn't match the key stored in the server.";
const INVALID_KEY_PAIR = "The provided key pair is not valid.";
const INVALID_FILE = "This is not a valid identity file. The identity has to be a JSON file containing the publicKey and the secretKey values.";
const LOAD_KEY_FAILED = "Sorry, something went wrong while importing the identity file, please try again. If the error persists, contact the Politeia support.";

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
    return pki.getKeys(this.props.loggedInAsEmail).then(keys => JSON.stringify(keys, null, 2));
  }

  auditIdentity = (keys) => {
    const { userPubkey } = this.props;

    // check that the pubkey matches with the server one
    if(keys.publicKey !== userPubkey)
      throw new Error(PUBLIC_KEY_MISMATCH);

    // check that the key pair is valid
    if(!pki.verifyKeyPair(keys)) {
      throw new Error(INVALID_KEY_PAIR);
    }
  }

  getJsonData = (base64) => {
    const data = atob(base64.split(",").pop());
    try {
      const json = JSON.parse(data);
      if (!json || !json.publicKey || !json.secretKey)
        throw new Error(INVALID_FILE);
      return json;
    } catch(e) {
      throw new Error(INVALID_FILE);
    }
  }

  onSelectFiles = ({ base64 }) => {
    const {  onIdentityImported } = this.props;
    try {
      const json = this.getJsonData(base64);
      this.auditIdentity(json);
      pki.importKeys(this.props.loggedInAsEmail, json)
        .then(() => {
          onIdentityImported("Successfully imported identity");
        })
        .catch(e => {
          console.error(e.stack);
          onIdentityImported(null, LOAD_KEY_FAILED);
        });
    } catch(e) {
      console.error(e.stack);
      onIdentityImported(null, e);
    }
  }
}

export default PrivateKeyIdentityManager;

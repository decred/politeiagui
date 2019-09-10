import React from "react";
import ReactFileReader from "react-file-reader";
import userConnector from "../connectors/user";
import {
  INVALID_FILE,
  INVALID_KEY_PAIR,
  LOAD_KEY_FAILED,
  PUBLIC_KEY_MISMATCH
} from "../constants";
import { getJsonData } from "../helpers";
import * as pki from "../lib/pki";
import Message from "./Message";

class PrivateKeyImportManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showErrorMessage: false
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.identityImportError !== nextProps.identityImportError) {
      this.setState({ showErrorMessage: true });
    }
  }
  componentDidMount() {
    this.fetchKeys().then(keyData => {
      if (!this.unmounting) {
        this.setState({ keyData });
      }
    });
  }
  render() {
    console.log(this.state.showErrorMessage && this.props.identityImportError);
    return (
      <div
        style={{
          width: "100%",
          padding: "1em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}
      >
        {this.props.identityImportError && this.state.showErrorMessage && (
          <Message
            type="error"
            header="Error importing identity"
            body={this.props.identityImportError}
          />
        )}
        <ReactFileReader
          base64
          handleFiles={this.onSelectFiles.bind(this)}
          multipleFiles={false}
          fileTypes="json"
        >
          <button style={{ marginRight: "0" }}>
            Upload JSON Identity File
          </button>
        </ReactFileReader>
      </div>
    );
  }

  fetchKeys() {
    return pki
      .getKeys(this.props.loggedInAsEmail)
      .then(keys => JSON.stringify(keys, null, 2));
  }

  auditIdentity = keys => {
    const { userPubkey } = this.props;

    // check that the pubkey matches with the server one
    if (keys.publicKey !== userPubkey) throw new Error(PUBLIC_KEY_MISMATCH);

    // check that the key pair is valid
    if (!pki.verifyKeyPair(keys)) {
      throw new Error(INVALID_KEY_PAIR);
    }
  };

  onSelectFiles = ({ base64 }) => {
    const { onIdentityImported, closeModal } = this.props;
    try {
      const json = getJsonData(base64);
      if (!json || !json.publicKey || !json.secretKey)
        throw new Error(INVALID_FILE);
      this.auditIdentity(json);
      pki
        .importKeys(this.props.loggedInAsEmail, json)
        .then(() => {
          onIdentityImported("Successfully imported identity") && closeModal();
        })
        .catch(e => {
          console.error(e.stack);
          onIdentityImported(null, LOAD_KEY_FAILED);
        });
    } catch (e) {
      console.error(e.stack);
      onIdentityImported(null, e);
    }
  };
}

export default userConnector(PrivateKeyImportManager);

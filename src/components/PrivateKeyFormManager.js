import React from "react";
import { reduxForm, Field } from "redux-form";
import userConnector from "../connectors/user";
import * as pki from "../lib/pki";

const PUBLIC_KEY_MISMATCH = "The provided public key doesn't match the key stored in the server.";
const INVALID_KEY_PAIR = "The provided key pair is not valid.";
const LOAD_KEY_FAILED = "Sorry, something went wrong while importing the identity file, please try again. If the error persists, contact the Politeia support.";

class PrivateKeyFormManager extends React.Component {
  render(){
    return (
      <div>
        <form className="import-identity-form" onSubmit={this.props.handleSubmit(this.handleKeys)}>
          <div style={{ width: "45em" }} className="c-form-group">
            <Field
              className="c-form-control"
              id="publicKey"
              name="publicKey"
              placeholder="Public Key"
              component="input"
              type="text" />
          </div>
          <div style={{ width: "45em" }} className="c-form-group">
            <Field
              className="c-form-control"
              id="secretKey"
              name="secretKey"
              placeholder="Private Key"
              type="password"
              component="input" />
            <button
              type="submit"
              tabIndex={7}
              disabled={this.props.pristine || this.props.submitting}
              style={{ margin: "2em 0 2em 2em", float: "right" }}
              className="c-btn c-btn-primary c-pull-left">Submit Identity</button>
          </div>
        </form>
      </div>
    );
  }

// Handles user-inputted keys by using props to save form values into store
// Uses same logic as OnSelectFiles from privKeyImportManager except 'props' is subsituted in place of 'keys'
handleKeys = (props) => {
  const { onIdentityImported, closeModal } = this.props;
  props = { ...props,
    publicKey: props.publicKey && props.publicKey.trim(),
    secretKey: props.secretKey && props.secretKey.trim()
  };
  try {
    this.auditIdentity(props);
    pki.importKeys(this.props.loggedInAsEmail, props)
      .then(() => {
        onIdentityImported("Successfully imported identity") && closeModal();
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

//Same as one from privKeyImportManager except it checks form input instead of uploaded file
auditIdentity = (props) => {
  const { userPubkey } = this.props;

  // check that the pubkey matches with the server one
  if(props.publicKey !== userPubkey)
    throw new Error(PUBLIC_KEY_MISMATCH);

  // check that the key pair is valid
  if(!pki.verifyKeyPair(props)) {
    throw new Error(INVALID_KEY_PAIR);
  }
}
}

export default userConnector(reduxForm({ form: "form/import-identity" })(PrivateKeyFormManager));

import React from "react";
import { reduxForm, Field } from "redux-form";
import userConnector from "../connectors/user";
import * as pki from "../lib/pki";

const PUBLIC_KEY_MISMATCH =
  "The provided public key doesn't match the key stored in the server.";
const INVALID_SECRET_KEY =
  "The provided secret key does not meet the length requirement.";
const INVALID_KEY_PAIR = "The provided key pair is not valid.";
const LOAD_KEY_FAILED =
  "Sorry, something went wrong while importing the identity file, please try again. If the error persists, contact the Politeia support.";
const lower = value => value && value.toLowerCase();

class PrivateKeyFormManager extends React.Component {
  render() {
    return (
      <form
        className="import-identity-form"
        onSubmit={this.props.handleSubmit(this.handleKeys)}
      >
        <div style={{ width: "45em" }} className="c-form-group">
          <Field
            className="c-form-control"
            id="publicKey"
            name="publicKey"
            placeholder="Public Key"
            component="input"
            validate={this.checkFormInput}
            normalize={lower}
            type="text"
          />
        </div>
        <div style={{ width: "45em" }} className="c-form-group">
          <Field
            className="c-form-control"
            id="secretKey"
            name="secretKey"
            placeholder="Private Key"
            component="input"
            validate={this.checkFormInput}
            normalize={lower}
            type="text"
          />
          <button
            type="submit"
            disabled={
              this.props.submitting || this.props.pristine || this.props.invalid
            }
            style={{ margin: "2em 0 2em 0" }}
            className="c-btn c-btn-primary c-pull-right"
          >
            Submit Identity
          </button>
          <button
            type="button"
            disabled={this.props.submitting || this.props.pristine}
            style={{ margin: "2em 0 2em 0", background: "#bf4153" }}
            onClick={this.props.reset}
            className="c-btn c-btn-primary c-pull-left"
          >
            Clear Values
          </button>
        </div>
      </form>
    );
  }

  //Checks to make sure user input has been receieved by both forms
  checkFormInput = values => {
    if (values) {
      return false;
    } else {
      return true;
    }
  };

  // Handles user-inputted keys by using props to save form values into store
  // Uses same logic as OnSelectFiles from privKeyImportManager except 'props' is subsituted in place of 'keys'
  handleKeys = props => {
    const { onIdentityImported, closeModal } = this.props;
    props = {
      ...props,
      publicKey: props.publicKey && props.publicKey.trim(),
      secretKey: props.secretKey && props.secretKey.trim()
    };
    try {
      this.auditIdentity(props);
      pki
        .importKeys(this.props.loggedInAsEmail, props)
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

  //Same as one from privKeyImportManager except it checks form input instead of uploaded file
  auditIdentity = props => {
    const { userPubkey } = this.props;

    // check that the pubkey matches with the server one
    if (props.publicKey !== userPubkey) throw new Error(PUBLIC_KEY_MISMATCH);

    // check that secret key is correct length
    if (props.secretKey.length < 128) throw new Error(INVALID_SECRET_KEY);

    // check that the key pair is valid
    if (!pki.verifyKeyPair(props)) {
      throw new Error(INVALID_KEY_PAIR);
    }
  };
}

export default userConnector(
  reduxForm({ form: "form/import-identity" })(PrivateKeyFormManager)
);

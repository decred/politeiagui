import React, { Fragment } from "react";
import { Field } from "redux-form";

import userPreferencesConnector from "../../connectors/userPreferences";
import ButtonWithLoadingIcon from "../snew/ButtonWithLoadingIcon";
import Message from "../Message";

const FieldGroup = ({ children }) => (
  <div style={{ marginBottom: 24 }}>{children}</div>
);

const FieldGroupHeader = ({ children }) => (
  <h3 style={{ marginBottom: 8 }}>{children}</h3>
);

const FieldContainer = ({ label, fieldWidth = 30, children }) => (
  <div className="field">
    <label className="field-label" style={{ minHeight: 1, width: 220 }}>
      {label && label + ":"}
    </label>
    <div className="field-value" style={{ width: fieldWidth }}>
      {children}
    </div>
    <div className="clear" />
  </div>
);

class PreferencesTab extends React.Component {
  constructor(...args) {
    super(...args);

    this.formRef = React.createRef();
    this.state = {
      showEditUserMessage: false,
      formChanged: false
    };
  }

  onEditUser = (...args) => {
    this.setState({ showEditUserMessage: true });
    return this.props.onEditUser(...args);
  };

  onChange = () => {
    this.setState({ formChanged: true });
  };

  render() {
    const {
      user,
      handleSubmit,
      editUserResponse,
      editUserError,
      isApiRequestingEditUser,
      isAdmin,
      loggedInAsUserId
    } = this.props;
    const isUserPageOwner = user && loggedInAsUserId === user.id;
    return (
      <form className="detail-form" onSubmit={handleSubmit(this.onEditUser)}>
        {this.state.showEditUserMessage && (
          <Fragment>
            {editUserError && (
              <Message
                type="error"
                header="Error saving preferences"
                body={editUserError}
              />
            )}
            {editUserResponse && (
              <Message type="success" header="Preferences saved" />
            )}
          </Fragment>
        )}
        <p style={{ marginBottom: 16 }}>
          <b>Note:</b> Currently, each notification email is only attempted to
          be sent once. If the email cannot be delivered in the initial attempt,
          for whatever reason, Politeia won't try to resend it.
        </p>
        <FieldGroup>
          <FieldGroupHeader>
            Email notifications for my proposals
          </FieldGroupHeader>
          <FieldContainer label="Proposal approved or censored">
            <Field
              autoFocus
              name="myproposalnotifications-statuschange"
              component="input"
              type="checkbox"
              disabled={!isUserPageOwner}
              onChange={this.onChange}
            />
          </FieldContainer>
          <FieldContainer label="Voting started for proposal">
            <Field
              name="myproposalnotifications-votestarted"
              component="input"
              type="checkbox"
              disabled={!isUserPageOwner}
              onChange={this.onChange}
            />
          </FieldContainer>
        </FieldGroup>
        <FieldGroup>
          <FieldGroupHeader>
            Email notifications for others' proposals
          </FieldGroupHeader>
          <FieldContainer label="New proposal published">
            <Field
              name="regularproposalnotifications-vetted"
              component="input"
              type="checkbox"
              disabled={!isUserPageOwner}
              onChange={this.onChange}
            />
          </FieldContainer>
          <FieldContainer label="Proposal edited">
            <Field
              name="regularproposalnotifications-edited"
              component="input"
              type="checkbox"
              disabled={!isUserPageOwner}
              onChange={this.onChange}
            />
          </FieldContainer>
          <FieldContainer label="Voting started for proposal">
            <Field
              name="regularproposalnotifications-votestarted"
              component="input"
              type="checkbox"
              disabled={!isUserPageOwner}
              onChange={this.onChange}
            />
          </FieldContainer>
        </FieldGroup>
        {isAdmin && isUserPageOwner && (
          <FieldGroup>
            <FieldGroupHeader>Admin email notifications</FieldGroupHeader>
            <FieldContainer label="New proposal submitted">
              <Field
                name="adminproposalnotifications-new"
                component="input"
                type="checkbox"
                onChange={this.onChange}
              />
            </FieldContainer>
            <FieldContainer label="Voting authorized for proposal">
              <Field
                name="adminproposalnotifications-voteauthorized"
                component="input"
                type="checkbox"
                onChange={this.onChange}
              />
            </FieldContainer>
          </FieldGroup>
        )}
        <FieldGroup>
          <FieldGroupHeader>Comment email notifications</FieldGroupHeader>
          <FieldContainer label="New comment on your proposal">
            <Field
              name="commentnotifications-proposal"
              component="input"
              type="checkbox"
              disabled={!isUserPageOwner}
              onChange={this.onChange}
            />
          </FieldContainer>
          <FieldContainer label="New comment reply to your comment">
            <Field
              name="commentnotifications-comment"
              component="input"
              type="checkbox"
              disabled={!isUserPageOwner}
              onChange={this.onChange}
            />
          </FieldContainer>
        </FieldGroup>
        {isUserPageOwner && (
          <FieldContainer fieldWidth={250}>
            <ButtonWithLoadingIcon
              className="c-btn c-btn-primary c-pull-left"
              type="submit"
              disabled={isApiRequestingEditUser || !this.state.formChanged}
              isLoading={isApiRequestingEditUser}
              text="Save preferences"
            />
          </FieldContainer>
        )}
      </form>
    );
  }
}

export default userPreferencesConnector(PreferencesTab);

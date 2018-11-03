import React, { Fragment } from "react";
import { Field } from "redux-form";

import userPreferencesConnector from "../../connectors/userPreferences";
import ButtonWithLoadingIcon from "../snew/ButtonWithLoadingIcon";
import Message from "../Message";


const FieldGroup = ({
  children
}) => (
  <div style={{ marginBottom: 24 }}>{children}</div>
);

const FieldGroupHeader = ({
  children
}) => (
  <h3 style={{ marginBottom: 8 }}>{children}</h3>
);

const FieldContainer = ({
  label,
  fieldWidth = 30,
  children
}) => (
  <div className="field">
    <label className="field-label" style={{ width: 220 }}>{label + ":"}</label>
    <div className="field-value" style={{ width: fieldWidth }}>{children}</div>
    <div className="clear"></div>
  </div>
);


class PreferencesTab extends React.Component {

  constructor(...args) {
    super(...args);

    this.state = {
      showEditUserMessage: false
    };
  }

  onEditUser = (...args) => {
    this.setState({ showEditUserMessage: true });
    return this.props.onEditUser(...args);
  }

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
                body={editUserError} />
            )}
            {editUserResponse && (
              <Message
                type="success"
                header="Preferences saved" />
            )}
          </Fragment>
        )}
        <FieldGroup>
          <FieldGroupHeader>Email notifications for my proposals</FieldGroupHeader>
          <FieldContainer label="Proposal approved or censored">
            <Field
              autoFocus
              name="myproposalnotifications-statuschange"
              component="input"
              type="checkbox"
              disabled={!isUserPageOwner} />
          </FieldContainer>
          <FieldContainer label="Voting started for proposal">
            <Field
              name="myproposalnotifications-votestarted"
              component="input"
              type="checkbox"
              disabled={!isUserPageOwner} />
          </FieldContainer>
        </FieldGroup>
        <FieldGroup>
          <FieldGroupHeader>Email notifications for others' proposals</FieldGroupHeader>
          <FieldContainer label="New proposal published">
            <Field
              name="regularproposalnotifications-vetted"
              component="input"
              type="checkbox"
              disabled={!isUserPageOwner} />
          </FieldContainer>
          <FieldContainer label="Proposal edited">
            <Field
              name="regularproposalnotifications-edited"
              component="input"
              type="checkbox"
              disabled={!isUserPageOwner} />
          </FieldContainer>
          <FieldContainer label="Voting started for proposal">
            <Field
              name="regularproposalnotifications-votestarted"
              component="input"
              type="checkbox"
              disabled={!isUserPageOwner} />
          </FieldContainer>
        </FieldGroup>
        {isAdmin && isUserPageOwner && (
          <FieldGroup>
            <FieldGroupHeader>Admin email notifications</FieldGroupHeader>
            <FieldContainer label="New proposal submitted">
              <Field
                name="adminproposalnotifications-new"
                component="input"
                type="checkbox" />
            </FieldContainer>
            <FieldContainer label="Voting authorized for proposal">
              <Field
                name="adminproposalnotifications-voteauthorized"
                component="input"
                type="checkbox" />
            </FieldContainer>
          </FieldGroup>
        )}
        {isUserPageOwner && (
          <FieldContainer label="" fieldWidth={250}>
            <ButtonWithLoadingIcon
              className="c-btn c-btn-primary c-pull-left"
              type="submit"
              disabled={isApiRequestingEditUser}
              isLoading={isApiRequestingEditUser}
              text="Save preferences" />
          </FieldContainer>
        )}
      </form>
    );
  }

}

export default userPreferencesConnector(PreferencesTab);

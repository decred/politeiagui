import React from "react";
import { Field, reduxForm } from "redux-form";
import ErrorField from "../Form/Fields/ErrorField";
import Message from "../Message";
import { PageLoadingIcon } from "../snew";
import { isApiRequestingInviteUser } from "../../selectors";
import ButtonWithLoadingIcon from "../snew/ButtonWithLoadingIcon";

const InviteUserForm = ({
  error,
  handleSubmit,
  onInviteUser,
  isRequesting,
  isShowingInviteUserConfirmation
}) => {
  if (isRequesting) {
    return <PageLoadingIcon />;
  }

  return (
    <div>
      <form
        className="reset-password-form"
        onSubmit={handleSubmit(onInviteUser)}
      >
        {error && <Message type="error" header=" error" body={error} />}
        <Field name="global" component={ErrorField} />
        <div className="c-form-group">
          <label className="screenreader-only" htmlFor="email">
            Email:
          </label>
          <Field
            autoFocus
            className="c-form-control"
            id="email"
            name="email"
            component="input"
            type="test"
            placeholder="Email"
            tabIndex={3}
          />
        </div>
        <div className="c-clearfix c-submit-group">
          <button
            className="c-btn c-btn-primary c-pull-right"
            tabIndex={3}
            type="submit"
          >
            Invite User
          </button>
        </div>
      </form>
      {isShowingInviteUserConfirmation ? (
        <Message type="info" header="Before you continue please confirm...">
          <ButtonWithLoadingIcon
            style={{ marginRight: "0px", overflow: "hidden" }}
            className="c-btn c-btn-primary c-pull-right"
            tabIndex={3}
            text="Confirm, invite user"
            isLoading={isApiRequestingInviteUser}
          />
        </Message>
      ) : null}
    </div>
  );
};

export default reduxForm({ form: "form/inviteuser" })(InviteUserForm);

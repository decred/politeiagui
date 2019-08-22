import { Formik, Field } from "formik";
import { Button, Card, Checkbox, H2, Message } from "pi-ui";
import React, { useState } from "react";
import { useUserPreferences } from "./hooks.js";
import styles from "./Preferences.module.css";

const Preferences = () => {
  const {
    user,
    loggedInAsUserId,
    editUserError,
    editUserResponse,
    isAdmin,
    isApiRequestingEditUser,
    initialValues,
    onEditUser
  } = useUserPreferences();
  const [showConfirm, setShowConfirm] = useState(false);
  const isUserPageOwner = user && loggedInAsUserId === user.id;
  const handlePreferencesSubmit = (...args) => {
    setShowConfirm(true);
    onEditUser(...args);
  };
  return isUserPageOwner ? (
    <Formik
      initialValues={initialValues}
      onSubmit={handlePreferencesSubmit}
    >
      {formikProps => {
        const {
          handleSubmit,
          setFieldValue,
          values
        } = formikProps;
        return (
          <form onSubmit={handleSubmit}>
            <div>
              {showConfirm && (
                <>
                  {editUserError && (
                    <Message className={styles.confirmMessage} kind="error">{editUserError}</Message>
                  )}
                  {editUserResponse && (
                    <Message className={styles.confirmMessage} kind="success">Preferences Saved</Message>
                  )}
                </>
              )}
              <Message className={styles.marginHorizontal1} kind="info">Currently, each notification email is only attempted to be sent once. If the email cannot be delivered in the initial attempt, for whatever reason, Politeia won't try to resend it.</Message>
              <Card className="container margin-top-s">
                <H2>Email notifications for my proposals</H2>
                <Field
                  component={Checkbox}
                  checked={values["myproposalnotifications-statuschange"]}
                  onChange={event => setFieldValue("myproposalnotifications-statuschange", event.target.checked)}
                  className="margin-top-m" id="1" name="myproposalnotifications-statuschange" label="Proposal approved or censored"
                />
                <Field
                  component={Checkbox}
                  checked={values["myproposalnotifications-votestarted"]}
                  onChange={event => setFieldValue("myproposalnotifications-votestarted", event.target.checked)}
                  className="margin-top-m" id="2" name="myproposalnotifications-votestarted" label="Voting started for proposal"
                />
              </Card>
              <Card className="container margin-top-s">
                <H2>Email notifications for others" proposals</H2>
                <Field
                  component={Checkbox}
                  checked={values["regularproposalnotifications-vetted"]}
                  onChange={event => setFieldValue("regularproposalnotifications-vetted", event.target.checked)}
                  className="margin-top-m" id="3" name="regularproposalnotifications-vetted" label="New proposal published"
                />
                <Field
                  component={Checkbox}
                  checked={values["regularproposalnotifications-edited"]}
                  onChange={event => setFieldValue("regularproposalnotifications-edited", event.target.checked)}
                  className="margin-top-m" id="4" name="regularproposalnotifications-edited" label="Proposal edited"
                />
                <Field
                  component={Checkbox}
                  checked={values["regularproposalnotifications-votestarted"]}
                  onChange={event => setFieldValue("regularproposalnotifications-votestarted", event.target.checked)}
                  className="margin-top-m" id="5" name="regularproposalnotifications-votestarted" label="Voting started for proposal"
                />
              </Card>
              {isAdmin && isUserPageOwner && (
                <Card className="container margin-top-s">
                  <H2>Admin email notifications</H2>
                  <Field
                    component={Checkbox}
                    checked={values["adminproposalnotifications-new"]}
                    onChange={event => setFieldValue("adminproposalnotifications-new", event.target.checked)}
                    className="margin-top-m" id="6" name="adminproposalnotifications-new" label="New proposal submitted"
                  />
                  <Field
                    component={Checkbox}
                    checked={values["adminproposalnotifications-voteauthorized"]}
                    onChange={event => setFieldValue("adminproposalnotifications-voteauthorized", event.target.checked)}
                    className="margin-top-m" id="7" name="adminproposalnotifications-voteauthorized" label="Voting authorized for proposal"
                  />
                </Card>
              )}
              <Card className="container margin-top-s">
                <H2>Comment email notifications</H2>
                <Field
                  component={Checkbox}
                  checked={values["commentnotifications-proposal"]}
                  onChange={event => setFieldValue("commentnotifications-proposal", event.target.checked)}
                  className="margin-top-m" id="8" name="commentnotifications-proposal" label="New comment on your proposal"
                />
                <Field
                  component={Checkbox}
                  checked={values["commentnotifications-comment"]}
                  onChange={event => setFieldValue("commentnotifications-comment", event.target.checked)}
                  className="margin-top-m" id="9" name="commentnotifications-comment" label="New comment reply to your comment"
                />
              </Card>
              <Button style={{ float: "right" }} type="submit" loading={isApiRequestingEditUser} className={styles.submitButton}>Save Preferences</Button>
            </div>
          </form>
        );
      }}
    </Formik>
  ) : (
    <Message kind="error">
      Only admins or the user himself can access this route.
    </Message>
  );
};

export default Preferences;

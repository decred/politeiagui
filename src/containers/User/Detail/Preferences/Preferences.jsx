import { Field, Formik } from "formik";
import { Button, Card, Checkbox, classNames, H2, Icon, Message } from "pi-ui";
import React, { useState } from "react";
import { useUserPreferences } from "./hooks.js";
import styles from "./Preferences.module.css";

const Preferences = ({ user }) => {
  const {
    currentUserID,
    editUserError,
    editUserResponse,
    isAdmin,
    isApiRequestingEditUser,
    initialValues,
    onEditUser
  } = useUserPreferences();
  const [showConfirm, setShowConfirm] = useState(false);
  const isUserPageOwner = user && currentUserID === user.userid;
  const handlePreferencesSubmit = (...args) => {
    setShowConfirm(true);
    onEditUser(...args);
  };
  return isUserPageOwner ? (
    <Formik
      initialValues={initialValues}
      onSubmit={handlePreferencesSubmit}
      enableReinitialize={true}
    >
      {(formikProps) => {
        const { handleSubmit, setFieldValue, values } = formikProps;
        const customSetFieldValue = (...props) => {
          setShowConfirm(false);
          setFieldValue(...props);
        };
        return (
          <form onSubmit={handleSubmit}>
            <div>
              <Message className={styles.marginHorizontal1} kind="info">
                Currently, each notification email is only attempted to be sent
                once. If the email cannot be delivered in the initial attempt,
                for whatever reason, Politeia won't try to resend it.
              </Message>
              <Card className="container margin-top-s">
                <H2>Email notifications for my proposals</H2>
                <Field
                  component={Checkbox}
                  checked={values["myproposalnotifications-statuschange"]}
                  onChange={(event) =>
                    customSetFieldValue(
                      "myproposalnotifications-statuschange",
                      event.target.checked
                    )
                  }
                  className="margin-top-m"
                  id="1"
                  name="myproposalnotifications-statuschange"
                  label="Proposal approved or censored"
                />
                <Field
                  component={Checkbox}
                  checked={values["myproposalnotifications-votestarted"]}
                  onChange={(event) =>
                    customSetFieldValue(
                      "myproposalnotifications-votestarted",
                      event.target.checked
                    )
                  }
                  className="margin-top-m"
                  id="2"
                  name="myproposalnotifications-votestarted"
                  label="Voting started for proposal"
                />
              </Card>
              <Card className="container margin-top-s">
                <H2>Email notifications for others' proposals</H2>
                <Field
                  component={Checkbox}
                  checked={values["regularproposalnotifications-vetted"]}
                  onChange={(event) =>
                    customSetFieldValue(
                      "regularproposalnotifications-vetted",
                      event.target.checked
                    )
                  }
                  className="margin-top-m"
                  id="3"
                  name="regularproposalnotifications-vetted"
                  label="New proposal published"
                />
                <Field
                  component={Checkbox}
                  checked={values["regularproposalnotifications-edited"]}
                  onChange={(event) =>
                    customSetFieldValue(
                      "regularproposalnotifications-edited",
                      event.target.checked
                    )
                  }
                  className="margin-top-m"
                  id="4"
                  name="regularproposalnotifications-edited"
                  label="Proposal edited"
                />
                <Field
                  component={Checkbox}
                  checked={values["regularproposalnotifications-votestarted"]}
                  onChange={(event) =>
                    customSetFieldValue(
                      "regularproposalnotifications-votestarted",
                      event.target.checked
                    )
                  }
                  className="margin-top-m"
                  id="5"
                  name="regularproposalnotifications-votestarted"
                  label="Voting started for proposal"
                />
              </Card>
              {isAdmin && isUserPageOwner && (
                <Card className="container margin-top-s">
                  <H2>Admin email notifications</H2>
                  <Field
                    component={Checkbox}
                    checked={values["adminproposalnotifications-new"]}
                    onChange={(event) =>
                      customSetFieldValue(
                        "adminproposalnotifications-new",
                        event.target.checked
                      )
                    }
                    className="margin-top-m"
                    id="6"
                    name="adminproposalnotifications-new"
                    label="New proposal submitted"
                  />
                  <Field
                    component={Checkbox}
                    checked={
                      values["adminproposalnotifications-voteauthorized"]
                    }
                    onChange={(event) =>
                      customSetFieldValue(
                        "adminproposalnotifications-voteauthorized",
                        event.target.checked
                      )
                    }
                    className="margin-top-m"
                    id="7"
                    name="adminproposalnotifications-voteauthorized"
                    label="Voting authorized for proposal"
                  />
                </Card>
              )}
              <Card className="container margin-top-s">
                <H2>Comment email notifications</H2>
                <Field
                  component={Checkbox}
                  checked={values["commentnotifications-proposal"]}
                  onChange={(event) =>
                    customSetFieldValue(
                      "commentnotifications-proposal",
                      event.target.checked
                    )
                  }
                  className="margin-top-m"
                  id="8"
                  name="commentnotifications-proposal"
                  label="New comment on your proposal"
                />
                <Field
                  component={Checkbox}
                  checked={values["commentnotifications-comment"]}
                  onChange={(event) =>
                    customSetFieldValue(
                      "commentnotifications-comment",
                      event.target.checked
                    )
                  }
                  className="margin-top-m"
                  id="9"
                  name="commentnotifications-comment"
                  label="New comment reply to your comment"
                />
              </Card>
              <Button
                width={195}
                type="submit"
                loading={isApiRequestingEditUser}
                kind={showConfirm ? "disabled" : "primary"}
                className={classNames(styles.submitButton, "margin-bottom-m")}
              >
                {showConfirm && editUserResponse ? (
                  <div className={styles.savedIcon}>
                    Saved
                    <Icon
                      type="checkmark"
                      backgroundColor="#e6eaed"
                      size="lg"
                      iconColor="#8997a5"
                    />
                  </div>
                ) : (
                  "Save preferences"
                )}
              </Button>
              {showConfirm && editUserError && (
                <Message className={styles.confirmMessage} kind="error">
                  {editUserError}
                </Message>
              )}
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

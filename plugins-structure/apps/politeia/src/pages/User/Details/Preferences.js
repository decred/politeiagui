import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { users } from "@politeiagui/core/user/users";
import {
  Checkbox,
  InfoMessage,
  RecordForm,
  SubmitButton,
  useToast,
} from "@politeiagui/common-ui";
import { InfoCard } from "../../../components";
import {
  emailNotificationsToPreferences,
  preferencesToEmailNotifications,
} from "./helpers";
import styles from "./styles.module.css";

function CheckboxSection({ title, items, ...props }) {
  return (
    <InfoCard title={title} {...props}>
      {items.map((item, i) => (
        <Checkbox id={item.name} name={item.name} label={item.label} key={i} />
      ))}
    </InfoCard>
  );
}

function UserPreferences({ userid }) {
  const dispatch = useDispatch();
  const { openToast } = useToast();

  const user = useSelector((state) => users.selectById(state, userid));
  const isAdmin = user.isadmin;
  const preferences = emailNotificationsToPreferences(user.emailnotifications);

  function handleSavePreferences(values) {
    const emailnotifications = preferencesToEmailNotifications(values);
    dispatch(users.edit({ emailnotifications, userid }))
      .then(() => {
        openToast({ title: "Preferences saved", kind: "success" });
      })
      .catch(() => {
        openToast({ title: "Error saving preferences", kind: "error" });
      });
  }
  return (
    <RecordForm
      className={styles.reset}
      formClassName={styles.reset}
      initialValues={preferences}
      mode="onTouched"
      onSubmit={handleSavePreferences}
    >
      <InfoMessage>
        Currently, only one attempt is made to send each notification email.
        Politeia will not try to resend an email if, for whatever reason, it
        cannot be delivered.
      </InfoMessage>
      <CheckboxSection
        data-testid="user-preferences-my-proposals"
        title="Email notifications for my proposals"
        items={[
          {
            name: "myProposalStatusChange",
            label: "Proposal approved or censored",
          },
          {
            name: "myProposalVoteStarted",
            label: "Voting started for proposal",
          },
        ]}
      />
      <CheckboxSection
        data-testid="user-preferences-others-proposals"
        title="Email notifications for other's proposals"
        items={[
          { name: "regularProposalVetted", label: "New proposal published" },
          { name: "regularProposalEdited", label: "Proposal edited" },
          {
            name: "regularProposalVoteStarted",
            label: "Voting started for proposal",
          },
        ]}
      />
      <CheckboxSection
        data-testid="user-preferences-comments"
        title="Email notifications for comments"
        items={[
          {
            name: "commentOnMyProposal",
            label: "New comment on your proposal",
          },
          {
            name: "commentOnMyComment",
            label: "New comment reply to your comment",
          },
        ]}
      />
      {isAdmin && (
        <CheckboxSection
          data-testid="user-preferences-admin"
          title="Admin email notifications"
          items={[
            { name: "adminProposalNew", label: "New proposal submitted" },
            {
              name: "adminProposalVoteAuthorized",
              label: "Voting authorized for proposal",
            },
          ]}
        />
      )}
      <div>
        <SubmitButton data-testid="user-preferences-save-button">
          Save Preferences
        </SubmitButton>
      </div>
    </RecordForm>
  );
}

export default UserPreferences;

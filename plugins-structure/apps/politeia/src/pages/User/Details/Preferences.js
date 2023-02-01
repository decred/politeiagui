import React from "react";
import styles from "./styles.module.css";
import {
  Checkbox,
  InfoMessage,
  RecordForm,
  SubmitButton,
} from "@politeiagui/common-ui";
import { InfoCard } from "../../../components";

import { user } from "./_mock";

function CheckboxSection({ title, items, ...props }) {
  return (
    <InfoCard title={title} {...props}>
      {items.map((item, i) => (
        <Checkbox id={item.name} name={item.name} label={item.label} key={i} />
      ))}
    </InfoCard>
  );
}

function UserPreferences() {
  const isAdmin = user.isadmin;

  function handleSavePreferences(values) {
    console.log("Saving...", values);
  }

  return (
    <RecordForm
      className={styles.reset}
      formClassName={styles.reset}
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
          { name: "approved", label: "Proposal approved or censored" },
          { name: "started", label: "Voting started for proposal" },
        ]}
      />
      <CheckboxSection
        data-testid="user-preferences-others-proposals"
        title="Email notifications for other's proposals"
        items={[
          { name: "newProposal", label: "New proposal published" },
          { name: "editedProposal", label: "Proposal edited" },
          { name: "startedOthers", label: "Voting started for proposal" },
        ]}
      />
      <CheckboxSection
        data-testid="user-preferences-comments"
        title="Email notifications for comments"
        items={[
          { name: "newComment", label: "New comment on your proposal" },
          { name: "newReply", label: "New comment reply to your comment" },
        ]}
      />
      {isAdmin && (
        <CheckboxSection
          data-testid="user-preferences-admin"
          title="Admin email notifications"
          items={[
            { name: "newProposalAdmin", label: "New proposal submitted" },
            {
              name: "authorizeAdmin",
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

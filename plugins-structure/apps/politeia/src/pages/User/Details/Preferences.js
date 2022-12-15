import React from "react";
import UserDetails from "./Details";
import styles from "./styles.module.css";
import {
  Checkbox,
  InfoMessage,
  RecordForm,
  SubmitButton,
} from "@politeiagui/common-ui";
import { InfoCard } from "../../../components";

import { user } from "./_mock";

function CheckboxSection({ title, items }) {
  return (
    <InfoCard title={title}>
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
    <UserDetails>
      <RecordForm
        className={styles.reset}
        formClassName={styles.form}
        onSubmit={handleSavePreferences}
      >
        <InfoMessage>
          Currently, only one attempt is made to send each notification email.
          Politeia will not try to resend an email if, for whatever reason, it
          cannot be delivered.
        </InfoMessage>
        <CheckboxSection
          title="Email notifications for my proposals"
          items={[
            { name: "approved", label: "Proposal approved or censored" },
            { name: "started", label: "Voting started for proposal" },
          ]}
        />
        <CheckboxSection
          title="Email notifications for other's proposals"
          items={[
            { name: "newProposal", label: "New proposal published" },
            { name: "editedProposal", label: "Proposal edited" },
            { name: "startedOthers", label: "Voting started for proposal" },
          ]}
        />
        <CheckboxSection
          title="Comment email notifications"
          items={[
            { name: "newComment", label: "New comment on your proposal" },
            { name: "newReply", label: "New comment reply to your comment" },
          ]}
        />
        {isAdmin && (
          <CheckboxSection
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
          <SubmitButton>Save Preferences</SubmitButton>
        </div>
      </RecordForm>
    </UserDetails>
  );
}

export default UserPreferences;

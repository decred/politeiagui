import React from "react";
import { SingleContentPage, TabsBanner } from "@politeiagui/common-ui/layout";
import { H1 } from "pi-ui";

export const TAB_LABELS = {
  identity: "Identity",
  account: "Account",
  preferences: "Preferences",
  credits: "Credits",
  proposals: "Submitted Proposals",
  drafts: "Draft Proposals",
  totp: "Two-Factor Authentication",
};

const TAB_KEYS = Object.keys(TAB_LABELS);

const getTabs = (userid) =>
  TAB_KEYS.map((tab) => (
    <a href={`/user/${userid}/${tab}`} data-link>
      {TAB_LABELS[tab]}
    </a>
  ));

// TODO: improve this title
const UserTitle = ({ title, subtitle }) => (
  <div>
    <H1>{title}</H1>
    <span>{subtitle}</span>
  </div>
);

function UserDetails({ tab, children }) {
  return (
    <SingleContentPage
      banner={
        <TabsBanner
          title={<UserTitle title={"My User"} subtitle={"myuser@email.com"} />}
          activeTab={TAB_KEYS.indexOf(tab || "identity")}
          tabs={getTabs("user-id-test")}
        />
      }
    >
      {children}
    </SingleContentPage>
  );
}
export default UserDetails;

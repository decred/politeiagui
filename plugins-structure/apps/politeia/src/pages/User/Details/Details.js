import React from "react";
import { SingleContentPage, TabsBanner } from "@politeiagui/common-ui/layout";
import { router } from "@politeiagui/core/router";

export const TAB_LABELS = {
  identity: "Identity",
  account: "Account",
  preferences: "Preferences",
  credits: "Credits",
  proposals: "Submitted Proposals",
  drafts: "Draft Proposals",
  "2fa": "Two-Factor Authentication",
};

const TAB_KEYS = Object.keys(TAB_LABELS);

const getTabs = (userid) =>
  TAB_KEYS.map((tab) => (
    <a href={`/user/${userid}/${tab}`} data-link>
      {TAB_LABELS[tab]}
    </a>
  ));

function UserDetails({ children }) {
  const location = router.getCurrentLocation();
  const activeTab = location.pathname.split("/")[3];
  return (
    <SingleContentPage
      banner={
        <TabsBanner
          title={"admin"}
          subtitle={"admin@example.com"}
          activeTab={TAB_KEYS.indexOf(activeTab || "identity")}
          tabs={getTabs("user-id-test")}
        />
      }
    >
      {children}
    </SingleContentPage>
  );
}
export default UserDetails;

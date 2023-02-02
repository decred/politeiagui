import React from "react";
import { SingleContentPage, TabsBanner } from "@politeiagui/common-ui/layout";
import { router } from "@politeiagui/core/router";
import { userAuth } from "@politeiagui/core/user/auth";
import { useSelector } from "react-redux";
import { users } from "@politeiagui/core/user/users";

export const TAB_LABELS = {
  identity: { title: "Identity", public: true },
  account: { title: "Account", public: true },
  preferences: { title: "Preferences", private: true },
  credits: { title: "Credits", private: true, admin: true },
  proposals: { title: "Submitted Proposals", public: true },
  drafts: { title: "Draft Proposals", private: true },
  "2fa": { title: "Two-Factor Authentication", private: true },
};

const getTabsToDisplay = (isCurrent, isAdmin) =>
  Object.keys(TAB_LABELS).filter(
    (tab) =>
      TAB_LABELS[tab].public ||
      (isAdmin && TAB_LABELS[tab].admin) ||
      (isCurrent && TAB_LABELS[tab].private)
  );

const formatTabs = (tabs, userid) =>
  tabs.map((tab) => (
    <a href={`/user/${userid}/${tab}`} data-link key={tab}>
      {TAB_LABELS[tab].title}
    </a>
  ));

function UserDetails() {
  const location = router.getCurrentLocation();
  const [, , userid, targetTab] = location.pathname.split("/");

  const user = useSelector((state) => users.selectById(state, userid));
  const currentUser = useSelector(userAuth.selectCurrent);

  const isCurrent = user && user?.id === currentUser?.userid;
  const isAdmin = currentUser?.isadmin;

  const tabsToDisplay = getTabsToDisplay(isCurrent, isAdmin);
  const tabActive = targetTab ? tabsToDisplay.indexOf(targetTab) : 0;
  const tabs = formatTabs(tabsToDisplay, userid);

  return (
    <SingleContentPage
      banner={
        <TabsBanner
          title={user?.username}
          subtitle={user?.email}
          activeTab={tabActive}
          tabs={tabs}
        />
      }
    >
      <div id="user-router" />
    </SingleContentPage>
  );
}
export default UserDetails;

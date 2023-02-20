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

/**
 * getTabsToDisplay - Returns the tabs to be displayed based on the user
 * type. Public tabs are always displayed. Private tabs are displayed
 * only if the user is the current user. Admin tabs are displayed only
 * if the user is an admin. Same tab can be either private or admin.
 * @param {boolean} isCurrentUser - Whether the user is the current user
 * @param {boolean} isAdmin - Whether the user is an admin
 * @returns {Array} - Array of tabs indexes to be displayed
 */
const getTabsIndexesToDisplay = (isCurrentUser, isAdmin) =>
  Object.keys(TAB_LABELS).filter(
    (tab) =>
      TAB_LABELS[tab].public ||
      (isAdmin && TAB_LABELS[tab].admin) ||
      (isCurrentUser && TAB_LABELS[tab].private)
  );

/**
 * formatTabs - Formats the tabs to be displayed in the banner.
 *  @param {Array} tabs - Array of tabs indexes to be displayed
 * @param {string} userid - User id
 * @returns {Array} - Array of formatted tabs
 */
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

  const tabsIndexesToDisplay = getTabsIndexesToDisplay(isCurrent, isAdmin);
  const tabActive = targetTab ? tabsIndexesToDisplay.indexOf(targetTab) : 0;
  const tabs = formatTabs(tabsIndexesToDisplay, userid);

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

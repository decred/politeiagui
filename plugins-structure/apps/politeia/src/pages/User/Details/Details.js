import React from "react";
import { SingleContentPage, TabsBanner } from "@politeiagui/common-ui/layout";
import { router } from "@politeiagui/core/router";
import { userAuth } from "@politeiagui/core/user/auth";
import { useSelector } from "react-redux";

export const TAB_LABELS = {
  identity: { title: "Identity", public: true },
  account: { title: "Account", public: true },
  preferences: { title: "Preferences", private: true },
  credits: { title: "Credits", private: true, admin: true },
  proposals: { title: "Submitted Proposals", public: true },
  drafts: { title: "Draft Proposals", private: true },
  "2fa": { title: "Two-Factor Authentication", private: true },
};

const TAB_KEYS = Object.keys(TAB_LABELS);

const getTabs = (userid, isCurrent, isAdmin) =>
  TAB_KEYS.map((tab) => {
    if (
      TAB_LABELS[tab].public ||
      (isAdmin && TAB_LABELS[tab].admin) ||
      (isCurrent && TAB_LABELS[tab].private)
    ) {
      return (
        <a href={`/user/${userid}/${tab}`} data-link>
          {TAB_LABELS[tab].title}
        </a>
      );
    }
    return null;
  }).filter((tab) => !!tab);

function UserDetails({ children }) {
  const location = router.getCurrentLocation();
  const [, , userid, activeTab] = location.pathname.split("/");
  // TODO: get user from users reducer as well. Only use current user if
  // userid is the same as currentUser's userid.

  const currentUser = useSelector(userAuth.selectCurrent);
  return (
    <SingleContentPage
      banner={
        <TabsBanner
          title={currentUser?.username}
          subtitle={currentUser?.email}
          activeTab={TAB_KEYS.indexOf(activeTab || "identity")}
          tabs={getTabs(
            currentUser?.userid,
            currentUser?.userid === userid,
            currentUser?.isadmin
          )}
        />
      }
    >
      {children}
    </SingleContentPage>
  );
}
export default UserDetails;

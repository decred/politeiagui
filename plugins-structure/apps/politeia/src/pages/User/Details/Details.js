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

function UserDetails() {
  const location = router.getCurrentLocation();
  const [, , userid, activeTab] = location.pathname.split("/");
  // TODO: get user from users reducer as well. Only use current user if
  // userid is the same as currentUser's userid.

  const user = useSelector((state) => users.selectById(state, userid));
  const currentUser = useSelector(userAuth.selectCurrent);
  const isCurrent = user && user?.id === currentUser?.userid;
  const isAdmin = currentUser?.isadmin;

  return (
    <SingleContentPage
      banner={
        <TabsBanner
          title={user?.username}
          subtitle={user?.email}
          activeTab={TAB_KEYS.indexOf(activeTab || "identity")}
          tabs={getTabs(userid, isCurrent, isAdmin)}
        />
      }
    >
      <div id="user-router" />
    </SingleContentPage>
  );
}
export default UserDetails;

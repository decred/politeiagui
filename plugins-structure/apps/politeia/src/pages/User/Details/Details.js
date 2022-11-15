import React from "react";
import { SingleContentPage, TabsBanner } from "@politeiagui/common-ui/layout";
import { H1 } from "pi-ui";
import { getURLSearchParams } from "../../../utils/getURLSearchParams";
import { UserProposals } from "./Proposals";

const WIPTab = () => <div>Work in Progress...</div>;

const TAB_LABELS = {
  identity: "Identity",
  account: "Account",
  preferences: "Preferences",
  credits: "Credits",
  proposals: "Submitted Proposals",
  drafts: "Draft Proposals",
  totp: "Two-Factor Authentication",
};
const TAB_VALUES = Object.values(TAB_LABELS);

const getTabs = (userid) =>
  TAB_VALUES.map((tab) => (
    <a href={`/user/${userid}?tab=${tab}`} data-link>
      {tab}
    </a>
  ));

function renderTabs({ tab, ...props }) {
  const mapTabComponent = {
    [TAB_LABELS.proposals]: <UserProposals {...props} />,
  };
  return mapTabComponent[tab] || <WIPTab />;
}

// TODO: improve this title
const UserTitle = ({ title, subtitle }) => (
  <div>
    <H1>{title}</H1>
    <span>{subtitle}</span>
  </div>
);

function UserDetails() {
  const { tab } = getURLSearchParams();
  return (
    <SingleContentPage
      // TODO: Replace hardcoded values with user values
      banner={
        <TabsBanner
          title={<UserTitle title={"My User"} subtitle={"myuser@email.com"} />}
          activeTab={TAB_VALUES.indexOf(tab || TAB_LABELS.identity)}
          tabs={getTabs("user-id-test")}
        />
      }
    >
      {renderTabs({ tab })}
    </SingleContentPage>
  );
}
export default UserDetails;

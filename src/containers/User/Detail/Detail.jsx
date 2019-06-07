import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { useUserDetail } from "./hooks";
import { useQueryStringWithIndexValue } from "src/lib/queryString";

const UserDetail = ({
  TopBanner,
  PageDetails,
  SideBanner,
  Sidebar,
  Main,
  Title,
  Tabs,
  Tab,
  match
}) => {
  const { onFetchUser, validateUUID, user } = useUserDetail();

  const tabLabels = ["General", "Preferences", "Proposals"];
  const [index, onSetIndex] = useQueryStringWithIndexValue("tab", 0, tabLabels);

  // Validate and set user id or throw an error in case it is invalid
  useEffect(function setUserID() {
    const userId = match && match.params && match.params.userid;
    if (!validateUUID(userId)) {
      throw new Error("Invalid user ID");
    } else {
      onFetchUser(userId);
    }
  }, []);

  // TODO: need a loading while user has not been fetched yet
  return user ? (
    <>
      <TopBanner>
        <PageDetails>
          <Title>{user.username}</Title>
          <Tabs onSelectTab={onSetIndex} activeTabIndex={index}>
            {tabLabels.map(label => (
              <Tab key={`tab${label}`} label={label} />
            ))}
          </Tabs>
        </PageDetails>
        <SideBanner />
      </TopBanner>
      <Sidebar />
      <Main>Main Content</Main>
    </>
  ) : null;
};

export default withRouter(UserDetail);

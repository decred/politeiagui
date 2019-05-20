import React from "react";
import PageLoadingIcon from "../snew/PageLoadingIcon";
import Message from "../Message";
import { Tabs, Tab } from "../Tabs";
import GeneralTab from "./GeneralTab";
import PreferencesTab from "./PreferencesTab";
import ProposalsTab from "./ProposalsTab";
import {
  USER_DETAIL_TAB_GENERAL,
  USER_DETAIL_TAB_PREFERENCES,
  USER_DETAIL_TAB_PROPOSALS
} from "../../constants";
import { CHANGE_USERNAME_MODAL } from "../Modal/modalTypes";
import userConnector from "../../connectors/user";

const UserDetailPage = ({
  isLoading,
  user,
  loggedInAsUserId,
  loggedInAsUsername,
  error,
  tabId,
  onTabChange,
  dcrdataTxUrl,
  openModal,
  getSubmittedUserProposals,
  isCMS
}) => {
  const proposals = user && user.id && getSubmittedUserProposals(user.id);
  return (
    <div className="content" role="main">
      <div className="page user-page">
        {isLoading && <PageLoadingIcon />}
        {error && (
          <Message type="error" header="Error loading user" body={error} />
        )}
        {user && (
          <div>
            <div className="detail-header">
              <div className="detail-username">
                {loggedInAsUserId === user.id
                  ? loggedInAsUsername
                  : user.username}
                {user.isadmin && (
                  <span className="detail-admin">(admin user)</span>
                )}
                {loggedInAsUserId === user.id ? (
                  <span
                    style={{
                      marginLeft: "1.25em",
                      marginTop: ".5em",
                      fontSize: ".75em"
                    }}
                    className="linkish"
                    onClick={() => openModal(CHANGE_USERNAME_MODAL)}
                  >
                    Change Username
                  </span>
                ) : null}
              </div>
              <div className="detail-email">{user.email}</div>
              <Tabs>
                <Tab
                  title="General"
                  selected={tabId === USER_DETAIL_TAB_GENERAL}
                  tabId={USER_DETAIL_TAB_GENERAL}
                  onTabChange={onTabChange}
                />
                {!isCMS ? (
                  <Tab
                    title="Preferences"
                    selected={tabId === USER_DETAIL_TAB_PREFERENCES}
                    tabId={USER_DETAIL_TAB_PREFERENCES}
                    onTabChange={onTabChange}
                  />
                ) : null}
                {!isCMS ? (
                  <Tab
                    title="Proposals"
                    count={proposals.length}
                    selected={tabId === USER_DETAIL_TAB_PROPOSALS}
                    tabId={USER_DETAIL_TAB_PROPOSALS}
                    onTabChange={onTabChange}
                  />
                ) : null}
              </Tabs>
            </div>
            <div className="detail-tab-body">
              {tabId === USER_DETAIL_TAB_GENERAL && (
                <GeneralTab dcrdataTxUrl={dcrdataTxUrl} />
              )}
              {tabId === USER_DETAIL_TAB_PREFERENCES && <PreferencesTab />}
              {tabId === USER_DETAIL_TAB_PROPOSALS && (
                <ProposalsTab count={proposals.length} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default userConnector(UserDetailPage);

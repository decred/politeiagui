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
    <div className="content user-page" role="main">
      {isLoading && <PageLoadingIcon />}
      {error && (
        <Message type="error" header="Error loading user" body={error} />
      )}
      {user && (
        <>
          <div className="detail-header">
            <h1 className="content-title">
              {loggedInAsUserId === user.id
                ? loggedInAsUsername
                : user.username}
              {user.isadmin && (
                <span className="detail-admin">(admin user)</span>
              )}
            </h1>
            {loggedInAsUserId === user.id ? (
              <span
                className="linkish"
                style={{ marginLeft: "10px" }}
                onClick={() => openModal(CHANGE_USERNAME_MODAL)}
              >
                Change Username
              </span>
            ) : null}
          </div>

          <div className="content-subtitle">{user.email}</div>
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
          {tabId === USER_DETAIL_TAB_GENERAL && (
            <GeneralTab dcrdataTxUrl={dcrdataTxUrl} />
          )}
          {tabId === USER_DETAIL_TAB_PREFERENCES && <PreferencesTab />}
          {tabId === USER_DETAIL_TAB_PROPOSALS && (
            <ProposalsTab count={proposals.length} />
          )}
        </>
      )}
    </div>
  );
};

export default userConnector(UserDetailPage);

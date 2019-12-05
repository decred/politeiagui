import React from "react";
import PageLoadingIcon from "../snew/PageLoadingIcon";
import Message from "../Message";
import { Tabs, Tab } from "../Tabs";
import GeneralTab from "./GeneralTab";
import PreferencesTab from "./PreferencesTab";
import ProposalsTab from "./ProposalsTab";
import InvoicesTab from "./InvoicesTab";
import ManageUserTab from "./ManageUserTab";
import {
  USER_DETAIL_TAB_GENERAL,
  USER_DETAIL_TAB_PREFERENCES,
  USER_DETAIL_TAB_PROPOSALS,
  USER_DETAIL_TAB_INVOICES,
  USER_DETAIL_TAB_MANAGE_USER
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
  getSubmittedUserInvoices,
  isCMS,
  isAdmin
}) => {
  const proposals =
    user && user.userid && getSubmittedUserProposals(user.userid);
  const invoices = user && user.userid && isCMS && getSubmittedUserInvoices;
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
              {loggedInAsUserId === user.userid
                ? loggedInAsUsername
                : user.username}
              {user.isadmin && (
                <span className="detail-admin">(admin user)</span>
              )}
            </h1>
            {loggedInAsUserId === user.userid ? (
              <span
                className="linkish"
                style={{ marginLeft: "10px" }}
                onClick={() => openModal(CHANGE_USERNAME_MODAL)}>
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
            {isCMS && isAdmin ? (
              <>
                <Tab
                  title="Invoices"
                  count={invoices.length}
                  selected={tabId === USER_DETAIL_TAB_INVOICES}
                  tabId={USER_DETAIL_TAB_INVOICES}
                  onTabChange={onTabChange}
                />
                <Tab
                  title="Manage User"
                  tabId={USER_DETAIL_TAB_MANAGE_USER}
                  selected={tabId === USER_DETAIL_TAB_MANAGE_USER}
                  onTabChange={onTabChange}
                />
              </>
            ) : null}
          </Tabs>
          {tabId === USER_DETAIL_TAB_GENERAL && (
            <GeneralTab dcrdataTxUrl={dcrdataTxUrl} />
          )}
          {tabId === USER_DETAIL_TAB_PREFERENCES && <PreferencesTab />}
          {tabId === USER_DETAIL_TAB_PROPOSALS && (
            <ProposalsTab count={proposals.length} />
          )}
          {tabId === USER_DETAIL_TAB_INVOICES && (
            <InvoicesTab count={invoices.length} />
          )}
          {tabId === USER_DETAIL_TAB_MANAGE_USER && <ManageUserTab />}
        </>
      )}
    </div>
  );
};

export default userConnector(UserDetailPage);

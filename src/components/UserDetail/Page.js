import React from "react";
import LoadingIcon from "../snew/LoadingIcon";
import Message from "../Message";
import { Tabs, Tab } from "../Tabs";
import GeneralTab from "./GeneralTab";
import ProposalsTab from "./ProposalsTab";
import CommentsTab from "./CommentsTab";
import {
  USER_DETAIL_TAB_GENERAL,
  USER_DETAIL_TAB_PROPOSALS,
  USER_DETAIL_TAB_COMMENTS
} from "../../constants";


const UserDetailPage = ({
  isLoading,
  user,
  error,
  tabId,
  onTabChange,
  dcrdataTxUrl
}) => (
  <div className="content" role="main">
    <div className="page user-page">
      {isLoading && <LoadingIcon />}
      {error && (
        <Message
          type="error"
          header="Error loading user"
          body={error}
        />
      )}
      {user && (
        <div>
          <div className="detail-header">
            <div className="detail-username">
              {user.username}
              {user.isadmin && (
                <span className="detail-admin">(admin user)</span>
              )}
            </div>
            <div className="detail-email">{user.email}</div>
            <Tabs>
              <Tab
                title="General"
                selected={tabId === USER_DETAIL_TAB_GENERAL}
                tabId={USER_DETAIL_TAB_GENERAL}
                onTabChange={onTabChange} />
              <Tab
                title="Proposals"
                count={(user.proposals && user.proposals.length) || 0}
                selected={tabId === USER_DETAIL_TAB_PROPOSALS}
                tabId={USER_DETAIL_TAB_PROPOSALS}
                onTabChange={onTabChange} />
              <Tab
                title={"Comments"}
                count={(user.comments && user.comments.length) || 0}
                selected={tabId === USER_DETAIL_TAB_COMMENTS}
                tabId={USER_DETAIL_TAB_COMMENTS}
                onTabChange={onTabChange} />
            </Tabs>
          </div>
          <div className="detail-tab-body">
            {tabId === USER_DETAIL_TAB_GENERAL && <GeneralTab dcrdataTxUrl={dcrdataTxUrl} />}
            {tabId === USER_DETAIL_TAB_PROPOSALS && <ProposalsTab />}
            {tabId === USER_DETAIL_TAB_COMMENTS && <CommentsTab />}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default UserDetailPage;


import React from "react";
import LoadingIcon from "../snew/LoadingIcon";
import Message from "../Message";
import GeneralTab from "./GeneralTab";
import ProposalsTab from "./ProposalsTab";
import CommentsTab from "./CommentsTab";
import {
  USER_DETAIL_TAB_GENERAL,
  USER_DETAIL_TAB_PROPOSALS,
  USER_DETAIL_TAB_COMMENTS
} from "../../constants";


const Tab = ({
  tabIndex,
  selectedTabIndex,
  onTabChange,
  children,
}) => (
  <a
    className={"detail-tab" + (selectedTabIndex === tabIndex ? " detail-tab-selected" : "")}
    onClick={() => onTabChange(tabIndex)}>
    {children}
  </a>
);

const UserDetailPage = ({
  isLoading,
  user,
  error,
  tabIndex,
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
            <div className="detail-tabs">
              <Tab
                tabIndex={USER_DETAIL_TAB_GENERAL}
                selectedTabIndex={tabIndex}
                onTabChange={onTabChange}>
                General
              </Tab>
              <Tab
                tabIndex={USER_DETAIL_TAB_PROPOSALS}
                selectedTabIndex={tabIndex}
                onTabChange={onTabChange}>
                Proposals <div className="detail-tab-count">{(user.proposals && user.proposals.length) || 0}</div>
              </Tab>
              <Tab
                tabIndex={USER_DETAIL_TAB_COMMENTS}
                selectedTabIndex={tabIndex}
                onTabChange={onTabChange}>
                Comments <div className="detail-tab-count">{(user.comments && user.comments.length) || 0}</div>
              </Tab>
              <div className="clear"></div>
              <div className="detail-tab-border"></div>
            </div>
          </div>
          <div className="detail-tab-body">
            {tabIndex === USER_DETAIL_TAB_GENERAL && <GeneralTab dcrdataTxUrl={dcrdataTxUrl} />}
            {tabIndex === USER_DETAIL_TAB_PROPOSALS && <ProposalsTab />}
            {tabIndex === USER_DETAIL_TAB_COMMENTS && <CommentsTab />}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default UserDetailPage;


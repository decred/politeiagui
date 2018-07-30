import React from "react";
import { withRouter } from "react-router-dom";
import ReactBody from "react-body";
import currentUserConnector from "../../connectors/currentUser";
import Dropdown from "../Dropdown";
import Link from "./Link";
import Tooltip from "../Tooltip";
import { areAllNotificationsViewed } from "../../helpers";

const UserInfo = ({
  history,
  loggedInAsEmail,
  loggedInAsUsername,
  notifications,
  userCanExecuteActions,
  proposalCredits,
  isApiRequestingUpdateProposalCredits,
  onUpdateProposalCredits
}) =>
  loggedInAsEmail ? (
    <div id="header-right">
      <div id="header-right-content">
        <ReactBody className="loggedin" />
        <div className="user">
          <Dropdown
            DropdownTrigger={
              <React.Fragment>
                <div className="dropdown-trigger">{loggedInAsUsername}</div>
                {
                  notifications && notifications.length > 0 && !areAllNotificationsViewed(notifications) &&
                  <div className="has-notification"></div>
                }
              </React.Fragment>
            }
            DropdownContent={
              <ul>
                <li
                  className="dropdown-list-item"
                  onClick={() => history.push("/user/notifications")}
                >
                  Notifications
                  {
                    notifications && notifications.length > 0 && !areAllNotificationsViewed(notifications) &&
                    <div className="has-notification"></div>
                  }
                </li>
                <li
                  className="dropdown-list-item"
                  onClick={() => history.push("/user/proposals")}
                >
                  Proposals
                </li>
                <li
                  className="dropdown-list-item"
                  onClick={() => history.push("/user/account")}
                >
                  Account
                </li>
                <li
                  className={`dropdown-list-item ${!userCanExecuteActions ? "disabled" : ""}`}
                  onClick={() => userCanExecuteActions ? history.push("/proposals/new") : null}
                >
                  Submit Proposal
                </li>
                <li
                  className="dropdown-list-item logout-button"
                  onClick={() => history.push("/user/logout")}
                >
                  <form className="logout hover" />
                  Log out
                </li>
              </ul>
            }
          />
        </div>
        <Tooltip
          text="Proposal credits are purchased to submit proposals. For more information,
          please visit your account page."
          position="bottom"
        >
          <div className="user-proposal-credits">
            {isApiRequestingUpdateProposalCredits ? (
              <div className="refreshing"><div className="logo spin"></div></div>
            ) : (
              <a className="refresh" onClick={onUpdateProposalCredits}>(refresh)</a>
            )}
            <div className="proposal-credits-text">{(proposalCredits || 0) + " proposal credit" + (proposalCredits !== 1 ? "s" : "")}</div>
          </div>
        </Tooltip>
      </div>
    </div>
  ) : (
    <div id="header-right">
      <div id="header-right-content">
        <Link href="/user/signup" className="login-required">
          Log in or sign up
        </Link>
      </div>
    </div>
  );

export default withRouter(currentUserConnector(UserInfo));

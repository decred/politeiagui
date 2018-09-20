import React from "react";
import { withRouter } from "react-router-dom";
import ReactBody from "react-body";
import currentUserConnector from "../../connectors/currentUser";
import Dropdown from "../Dropdown";
import Link from "./Link";
import Tooltip from "../Tooltip";
import { PROPOSAL_CREDITS_MODAL } from "../Modal/modalTypes";


const UserInfo = ({
  history,
  loggedInAsEmail,
  loggedInAsUsername,
  userCanExecuteActions,
  proposalCredits,
  openModal
}) =>
  loggedInAsEmail ? (
    <div id="header-right">
      <div id="header-right-content">
        <ReactBody className="loggedin" />
        <div className="user">
          <Dropdown
            DropdownTrigger={
              <div className="dropdown-trigger">{loggedInAsUsername}</div>
            }
            DropdownContent={
              <ul>
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
            <a className="buy-proposals-credits" onClick={() => openModal(PROPOSAL_CREDITS_MODAL)}>(Manage proposal credits)</a>
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

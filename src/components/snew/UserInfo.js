import React from "react";
import { withRouter } from "react-router-dom";
import ReactBody from "react-body";
import connector from "../../connectors/currentUser";
import Dropdown from "../Dropdown";
import Link from "./Link";

const UserInfo = ({ history, loggedInAsEmail, loggedInAsUsername }) =>
  loggedInAsEmail ? (
    <div id="header-bottom-right" style={{ display: "flex" }}>
      <ReactBody className="loggedin" />
      <span className="user">
        <Dropdown
          DropdownTrigger={<div className="dropdown-trigger">{loggedInAsUsername}</div>}
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
                className="dropdown-list-item logout-button"
                onClick={() => history.push("/user/logout")}
              >
                <form className="logout hover" />
                Log out
              </li>
            </ul>
          }
        />
      </span>
    </div>
  ) : (
    <div id="header-bottom-right">
      <Link href="/user/signup" className="login-required">
        Log in or sign up
      </Link>
    </div>
  );

export default withRouter(connector(UserInfo));



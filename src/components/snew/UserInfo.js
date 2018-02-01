import React from "react";
import { withRouter } from "react-router-dom";
import ReactBody from "react-body";
import connector from "../../connectors/currentUser";
import Dropdown from "../Dropdown";
import Link from "./Link";

const UserInfo = ({ history, loggedInAs }) =>
  loggedInAs ? (
    <div id="header-bottom-right" style={{ display: "flex" }}>
      <ReactBody className="loggedin" />
      <span className="user">
        <Dropdown
          DropdownTrigger={<div>{loggedInAs}</div>}
          DropdownContent={
            <div>
              <ul>
                <li
                  className="dropdown-list-item"
                  onClick={() => history.push("/user/proposals")}
                >
                  Your Proposals
                </li>
                <li
                  className="dropdown-list-item"
                  onClick={() => history.push("/user/key")}
                >
                  Update Key Pair
                </li>
                <li
                  className="dropdown-list-item"
                  onClick={() => history.push("/user/password/change")}
                >
                  Change Password
                </li>
                <li
                  className="dropdown-list-item"
                  onClick={() => history.push("/user/logout")}
                >
                  <form className="logout hover" />
                  Log out
                </li>
              </ul>
            </div>
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



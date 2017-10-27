import React from "react";
import LinkComponent from "./Link";
import connector from "../../connectors/currentUser";

const UserInfo = ({
  Link = LinkComponent,
  loggedInAs,
  isAdmin
}) => loggedInAs ? (
  <div id="header-bottom-right">
    <span className="user">
      <Link href="/user/profile/">{loggedInAs}</Link> {isAdmin
        ? (<Link href="/admin"><span className="userkarma" title="post karma" >admin</span></Link>) : null}
    </span>
    <span className="separator">|</span>
    <form className="logout hover" >
      <Link href="/user/logout">logout</Link>
    </form>
  </div>
) : (
  <div id="header-bottom-right">
    <Link href="/user/signup" className="login-required">Log in or sign up</Link>
  </div>
);

export default connector(UserInfo);



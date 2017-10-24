import React from "react";
import LinkComponent from "./Link";
import connector from "../../connectors/currentUser";

const UserInfo = ({
  Link = LinkComponent,
  loggedInAs,
  isAdmin
}) => (
  <div id="header-bottom-right">
    <span className="user">
      <Link href="/user/me/">{loggedInAs}</Link> {isAdmin
        ? (<span className="userkarma" title="post karma" >admin</span>) : null}
    </span>
    <span className="separator">|</span>
    <form className="logout hover" >
      <Link href="/user/logout">logout</Link>
    </form>
  </div>
);

export default connector(UserInfo);



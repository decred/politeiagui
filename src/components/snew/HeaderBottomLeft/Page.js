import React from "react";
import Link from "../Link";
import currentUserConnector from "../../../connectors/currentUser";

const HeaderBottomLeft = ({
  subredditData,
  useStyle,
  isAdmin
}) => (
  <div id="header-bottom-left">
    {useStyle && subredditData && subredditData.header_img ? (
      <Link href="/">
        <img
          id="header-img"
          src={subredditData.header_img}
          alt={subredditData.display_name}
        />
      </Link>
    ) : (
      <Link
        className="default-header"
        href="/"
        id="header-img"
      >
        Decred
      </Link>
    )}
    <span className="hover pagename redditname">
      <Link href="/">Politeia</Link>
    </span>
    <ul className="tabmenu">
      {isAdmin ? <li>
        <Link className="choice" href="/admin/">
          Admin
        </Link>
      </li> : null}
    </ul>
  </div>
);

export default currentUserConnector(HeaderBottomLeft);

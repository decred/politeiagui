import React from "react";
import connector from "../../connectors/currentUser";

export const HeaderBottomLeft = ({
  Link,
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
    )} <span className="hover pagename redditname">
      <Link href="/">Politeia</Link>
    </span>
    <ul className="tabmenu">
      <li /*className="selected"*/>
        <Link className="choice" href="/">
          Proposals
        </Link>
      </li>
      {isAdmin ? <li>
        <Link className="choice" href="/admin/">
          Admin
        </Link>
      </li> : null}
    </ul>
  </div>
);

export default connector(HeaderBottomLeft);

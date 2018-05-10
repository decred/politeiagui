import React from "react";
import connector from "../../connectors/actions";

const SubmitTextSidebox = ({
  Link, loggedInAsEmail, userCanExecuteActions
}) => loggedInAsEmail ? (
  <div className="spacer">
    <div className={`sidebox submit submit-text ${!userCanExecuteActions ? "not-active disabled" : null}`}>
      <div className="morelink">
        <Link
          className="login-required access-required"
          data-event-action="submit"
          data-event-detail="self"
          data-type="subreddit"
          href="/proposals/new"
        />
        <div className="nub" />
      </div>
    </div>
  </div>
) : null;

export default connector(SubmitTextSidebox);

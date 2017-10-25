import React from "react";
import connector from "../../connectors/actions";

const SubmitTextSidebox = ({
  Link, loggedInAs
}) => loggedInAs ? (
  <div className="spacer">
    <div className="sidebox submit submit-text">
      <div className="morelink">
        <Link
          className="login-required access-required"
          data-event-action="submit"
          data-event-detail="self"
          data-type="subreddit"
          href="/proposals/new"
        >
          Submit a new Proposal
        </Link>
        <div className="nub" />
      </div>
    </div>
  </div>
) : null;

export default connector(SubmitTextSidebox);


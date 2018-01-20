import React from "react";
import connector from "../../connectors/actions";
import WarningPaywallNotPaid from "./WarningPaywallNotPaid";

const SubmitTextSidebox = ({
  Link, loggedInAs, grantAccess
}) => loggedInAs ?
  grantAccess ? (
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
  ) : <WarningPaywallNotPaid
    message="You can not send Proposals before paying The Paywall" />
  : null;

export default connector(SubmitTextSidebox);


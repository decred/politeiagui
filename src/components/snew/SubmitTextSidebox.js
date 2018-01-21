import React from "react";
import connector from "../../connectors/actions";
import WarningPaywallNotPaid from "./WarningPaywallNotPaid";

const SubmitTextSidebox = ({
  Link, loggedInAs, grantAccess
}) => loggedInAs ? (
  <div className="spacer">
    <div className={`sidebox submit submit-text ${!grantAccess ? "not-active" : null}`}>
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
    {!grantAccess && <WarningPaywallNotPaid
      message="You must pay the registration fee before you can submit a proposal." />}
  </div>
) : null;

export default connector(SubmitTextSidebox);


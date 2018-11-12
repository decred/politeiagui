import React from "react";
import actionsConnector from "../../connectors/actions";
import { PAYWALL_STATUS_PAID } from "../../constants";

const SubmitTextSidebox = ({ Link, loggedInAsEmail, userPaywallStatus }) => {
  const isPaywallPaid = userPaywallStatus === PAYWALL_STATUS_PAID;
  return loggedInAsEmail ? (
    <div className="spacer">
      <div className="sidebox submit submit-text">
        <div
          className={`morelink ${isPaywallPaid ? "" : " not-active disabled"}`}
        >
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
};
export default actionsConnector(SubmitTextSidebox);

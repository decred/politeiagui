import React from "react";
import Tooltip from "./Tooltip";
import userBadgeConnector from "../connectors/userBadge";
import {
  PAYWALL_STATUS_PAID,
  PAYWALL_STATUS_LACKING_CONFIRMATIONS,
  PAYWALL_STATUS_WAITING
} from "../constants";

const UserBadge = ({ userPaywallStatus, loggedInAsEmail }) => {
  return !loggedInAsEmail ? null : userPaywallStatus ===
    PAYWALL_STATUS_WAITING ? (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
      }}
    >
      <div className="col-sm-1">
        <Tooltip
          tipStyle={{
            fontSize: "11px",
            top: "20px",
            left: "20px",
            width: "100px"
          }}
          text="To complete your registration, please pay the registration fee"
          position="bottom"
        >
          <div className="roundbadge-grey hollow">
            <span className="fa fa-user-times fa-lg grey" aria-hidden="true" />
          </div>
        </Tooltip>
      </div>
    </div>
  ) : userPaywallStatus === PAYWALL_STATUS_LACKING_CONFIRMATIONS ? (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
      }}
    >
      <div className="col-sm-1">
        <Tooltip
          tipStyle={{
            fontSize: "11px",
            top: "20px",
            left: "20px",
            width: "100px"
          }}
          text="We detected your payment and we're waiting for
            server confirmations"
          position="bottom"
        >
          <div className="roundbadge-waiting hollow">
            <span className="fa fa-user-times fa-lg" aria-hidden="true" />
          </div>
        </Tooltip>
      </div>
    </div>
  ) : userPaywallStatus === PAYWALL_STATUS_PAID ? (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center"
      }}
    >
      <div className="col-sm-1">
        <Tooltip
          tipStyle={{
            fontSize: "11px",
            top: "20px",
            left: "20px",
            width: "100px"
          }}
          text="Account verified. Welcome to Politeia!"
          position="bottom"
        >
          <div className="roundbadge-paid hollow">
            <span className="fa fa-user fa-lg" aria-hidden="true" />
          </div>
        </Tooltip>
      </div>
    </div>
  ) : null;
};

export default userBadgeConnector(UserBadge);

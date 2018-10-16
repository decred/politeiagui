import React from "react";
import Message from "../Message";
import paywallConnector from "../../connectors/paywall";
import actionsConnector from "../../connectors/actions";
import {
  PAYWALL_STATUS_PAID, PAYWALL_STATUS_WAITING
} from "../../constants";
import { PAYWALL_MODAL } from "../Modal/modalTypes";

const PaywallAlert = ({
  userPaywallStatus,
  userAlreadyPaid,
  openModal,
  loggedInAsEmail,
  onResetAppPaywallInfo
}) => {
  return !loggedInAsEmail ? null : (
    userPaywallStatus === PAYWALL_STATUS_PAID && userAlreadyPaid ?
      <Message
        type="success"
        header="Registration payment complete"
        body={
          <div>
            Thank you for registering on Politeia!
            <br /><br />
            Welcome aboard.
            <br />
          </div>
        }
        onDismissClick={ () => {
          onResetAppPaywallInfo();
        }}
      /> : userPaywallStatus === PAYWALL_STATUS_PAID ?
        null :
        <React.Fragment>
          {userPaywallStatus === PAYWALL_STATUS_WAITING ?
            <Message
              type="info"
              header="Complete your registration"
              body={<div>
              You won't be able to submit comments or proposals before paying the fee.
                <br /><br />
                <span
                  className="linkish"
                  onClick={() => openModal(PAYWALL_MODAL)}
                >
              Pay the registration fee.
                </span>
              </div>}
            /> :
            <Message
              type="info"
              header="Registration payment detected"
              body={<div>
              Your registration will be complete once it
              reaches the required amount of confirmations.
                <br /> <br />
                <span
                  className="linkish"
                  onClick={() => openModal(PAYWALL_MODAL)}
                >
              Check the payment status.
                </span>
              </div>}
            />
          }
        </React.Fragment>
  );
};

export default actionsConnector(paywallConnector(PaywallAlert));

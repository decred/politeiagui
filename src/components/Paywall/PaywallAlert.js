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
  openModal
}) => {
  return (
    userPaywallStatus === PAYWALL_STATUS_PAID ?
      null :
      <React.Fragment>
        {userPaywallStatus === PAYWALL_STATUS_WAITING ?
          <Message
            type="info"
            header="Complete your registration"
            body={<div>
              <span
                className="linkish"
                onClick={() => openModal(PAYWALL_MODAL)}
              >
              Pay the registration fee and complete your registration.
              </span>
              <br />
            You won't be able to submit comments or proposals before that.
            </div>}
          /> :
          <Message
            type="info"
            header="Complete your registration"
            body={<div>
              Your payment was detected and its waiting the required amount of confirmations.
              <br />
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

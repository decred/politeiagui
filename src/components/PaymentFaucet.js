import React from "react";
import paymentFaucetConnector from "../connectors/paymentFaucet";
import ButtonWithLoadingIcon from "./snew/ButtonWithLoadingIcon";
import Message from "./Message";

const FAUCET_BASE_URL = "https://testnet.dcrdata.org/explorer/tx";
const getFaucetUrl = (txid) => `${FAUCET_BASE_URL}/${txid}`;

const PaymentFaucet = ({
  // from connector props
  payWithFaucetError,
  payWithFaucet,
  payWithFaucetTxId,
  isApiRequestingPayWithFaucet,
  isTestnet,

  // from parent props
  paywallAddress,
  paywallAmount
}) => {
  return !isTestnet ? null : (
    <div className="paywall-faucet">
      <div className="paywall-faucet-testnet">Testnet</div>
      <p>
        This Politeia instance is running on Testnet, which means you can pay
        with the Decred faucet:
      </p>
      {payWithFaucetTxId ? null : (
        <ButtonWithLoadingIcon
          className="c-btn c-btn-primary float-right inverse"
          text="Pay with Faucet"
          isLoading={isApiRequestingPayWithFaucet}
          onClick={() => payWithFaucet(paywallAddress, paywallAmount)}
        />
      )}
      {payWithFaucetError ? (
        <Message type="error" header="Faucet error" body={payWithFaucetError} />
      ) : null}
      {payWithFaucetTxId ? (
        <Message type="info" header="Sent payment">
          Sent transaction{" "}
          <a
            className="paywall-payment-sent"
            href={getFaucetUrl(payWithFaucetTxId)}
            target="_blank"
            rel="noopener noreferrer">
            {payWithFaucetTxId}
          </a>{" "}
          to the address; it may take a few minutes to be confirmed.
        </Message>
      ) : null}
    </div>
  );
};

class Wrapper extends React.Component {
  componentWillUnmount() {
    this.props.resetFaucet();
  }
  render() {
    const { Component, ...props } = this.props;
    return <Component {...{ ...props }} />;
  }
}

const wrap = (Component) => (props) => <Wrapper {...{ ...props, Component }} />;

export default paymentFaucetConnector(wrap(PaymentFaucet));

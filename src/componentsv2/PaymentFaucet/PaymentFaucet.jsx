import { Button, Link, Message, P } from "pi-ui";
import React from "react";
import useFaucet from "./hooks";

const FAUCET_BASE_URL = "https://testnet.dcrdata.org/explorer/tx";
const getFaucetUrl = txid => `${FAUCET_BASE_URL}/${txid}`;

const PaymentFaucet = ({ address, amount, isPaid }) => {
  const {
    payWithFaucetError,
    payWithFaucet,
    payWithFaucetTxId,
    isApiRequestingPayWithFaucet,
    isTestnet
  } = useFaucet();
  return !isTestnet && !isPaid ? null : (
    <div className="paywall-faucet">
      <P className="margin-top-m">
        This Politeia instance is running on Testnet, which means you can pay
        with the Decred faucet:
      </P>
      {payWithFaucetTxId ? null : (
        <Button
          className="margin-top-s"
          loading={isApiRequestingPayWithFaucet}
          onClick={() => payWithFaucet(address, amount)}
        >
          Pay with Faucet
        </Button>
      )}
      {payWithFaucetError ? (
        <Message type="error" header="Faucet error" body={payWithFaucetError} />
      ) : null}
      {payWithFaucetTxId ? (
        <Message kind="info">
          Sent transaction:{" "}
          <Link
            href={getFaucetUrl(payWithFaucetTxId)}
            target="_blank"
            id="transactionLink"
            truncate
            rel="noopener noreferrer"
          >
            {payWithFaucetTxId}
          </Link>
        </Message>
      ) : null}
    </div>
  );
};

export default PaymentFaucet;

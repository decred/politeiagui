import { Button, Link, Message, P } from "pi-ui";
import React from "react";
import useFaucet from "./hooks";
import styles from "./PaymentFaucet.module.css";

const FAUCET_BASE_URL = "https://testnet.dcrdata.org/explorer/tx";
const getFaucetUrl = txid => `${FAUCET_BASE_URL}/${txid}`;

const PaymentFaucet = ({ address, amount }) => {
  const {
    payWithFaucetError,
    payWithFaucet,
    payWithFaucetTxId,
    isApiRequestingPayWithFaucet,
    isTestnet
  } = useFaucet();
  return (
    isTestnet && (
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
          <Message
            type="error"
            header="Faucet error"
            body={payWithFaucetError}
          />
        ) : null}
        {payWithFaucetTxId ? (
          <Message kind="info" className={styles.transactionIdMessage}>
            <span style={{ marginRight: "5px" }}>Sent transaction: </span>
            <Link
              href={getFaucetUrl(payWithFaucetTxId)}
              target="_blank"
              id="transactionLink"
              truncate
              rel="noopener noreferrer"
              className={styles.transactionIdLink}
            >
              {payWithFaucetTxId}
            </Link>
          </Message>
        ) : null}
      </div>
    )
  );
};

export default PaymentFaucet;

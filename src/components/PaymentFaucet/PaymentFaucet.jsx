import { Button, Link, Message, P } from "pi-ui";
import React, { useCallback } from "react";
import useNavigation from "src/hooks/api/useNavigation";
import useFaucet from "./hooks";
import styles from "./PaymentFaucet.module.css";

const noop = () => {};
const FAUCET_BASE_URL = "https://testnet.decred.org/explorer/tx";
const getFaucetUrl = (txid) => `${FAUCET_BASE_URL}/${txid}`;

const PaymentFaucet = ({ address, amount, onFail = noop }) => {
  const { user } = useNavigation();
  const {
    payWithFaucetError,
    payWithFaucet,
    payWithFaucetTxId,
    isApiRequestingPayWithFaucet,
    isTestnet
  } = useFaucet();

  const handlePayment = useCallback(
    () => payWithFaucet(address, amount, user.userid).catch(onFail),
    [address, amount, user.userid, payWithFaucet, onFail]
  );
  return (
    isTestnet && (
      <div className={styles.paywallFaucet}>
        <P className="margin-top-m">
          This Politeia instance is running on Testnet, which means you can pay
          with the Decred faucet:
        </P>
        {payWithFaucetTxId ? null : (
          <Button
            className="margin-top-s"
            loading={isApiRequestingPayWithFaucet}
            onClick={handlePayment}
          >
            Pay with Faucet
          </Button>
        )}
        {payWithFaucetError ? (
          <Message kind="error" className="margin-top-m">
            {payWithFaucetError.toString()}
          </Message>
        ) : null}
        {payWithFaucetTxId ? (
          <Message kind="info" className={styles.transactionIdMessage}>
            <span className={styles.transactionLabel}>Sent transaction: </span>
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

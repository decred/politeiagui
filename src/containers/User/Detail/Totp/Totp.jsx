import React, { useState, useCallback, useEffect } from "react";
import {
  Card,
  Spinner,
  H2,
  P,
  CopyableText,
  Button,
  Message,
  Link
} from "pi-ui";
import useTotp from "../hooks/useTotp";
import styles from "./Totp.module.css";
import DigitsInput from "src/components/DigitsInput";
import { TOTP_CODE_LENGTH } from "src/constants";

const VerifyTotp = ({ onVerify, label }) => {
  const [enableVerify, setEnableVerify] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [code, setCode] = useState("");
  const onFillCode = (newCode) => {
    setEnableVerify(newCode.length === TOTP_CODE_LENGTH);
    setCode(newCode);
    setError(false);
    setSuccess(false);
  };
  const handleVerify = (e) => {
    e && e.preventDefault();
    onVerify(code)
      .then(() => setSuccess(true))
      .catch((e) => setError(e));
  };
  return (
    <div>
      {success && (
        <Message kind="success" className="margin-bottom-m">
          TOTP code successfully verified!
        </Message>
      )}
      {error && (
        <Message kind="error" className="margin-bottom-m">
          {error.toString()}
        </Message>
      )}
      <H2>Verify TOTP</H2>
      <P>
        TOTP Token already set. You can verify it by using the key generated by
        your TOTP authenticator.
      </P>
      <DigitsInput onChange={onFillCode} />
      <Button
        kind={enableVerify ? "primary" : "disabled"}
        onClick={handleVerify}>
        {label}
      </Button>
    </div>
  );
};

const SetTotp = ({ totp = {} }) => {
  return (
    <div className="margin-bottom-m">
      <H2>Set TOTP Authentication</H2>
      <div className={styles.setContainer}>
        <div className={styles.qrcode}>
          {totp.image && (
            <img src={`data:image/png;base64, ${totp.image}`} alt={totp.key} />
          )}
        </div>
        <div className={styles.instructions}>
          <P>Step 1 - scan the QR Code with a TOTP Authenticator</P>
          <P>
            Step 2 - verify the 6-numbers code to activate the authentication
          </P>
          <div className={styles.copyableKey}>
            {totp.key && <CopyableText id="totp-key">{totp.key}</CopyableText>}
          </div>
        </div>
      </div>
    </div>
  );
};

const Totp = () => {
  const { loading, alreadySet, totp, onVerifyTotp, onSetTotp } = useTotp();
  const [verifyMode, setVerifyMode] = useState(true);
  const [isTotpSet, setIsTotpSet] = useState(alreadySet);

  useEffect(() => {
    setIsTotpSet(alreadySet);
  }, [alreadySet]);

  const handleToggleVerifyMode = useCallback(() => {
    setVerifyMode(!verifyMode);
  }, [verifyMode]);

  const handleResetTotp = (code) =>
    onSetTotp(code).then(() => {
      setIsTotpSet(false);
      setVerifyMode(true);
    });

  const handleVerifyTotp = (code) =>
    onVerifyTotp(code).then(() => {
      setIsTotpSet(true);
    });

  return loading ? (
    <Spinner invert />
  ) : (
    <Card paddingSize="small">
      {!isTotpSet && <SetTotp totp={totp} />}
      <VerifyTotp
        onVerify={verifyMode ? handleVerifyTotp : handleResetTotp}
        label={verifyMode ? "Verify" : "Reset TOTP Key"}
      />
      {isTotpSet && verifyMode && (
        <Link className={styles.resetLink} onClick={handleToggleVerifyMode}>
          Reset Totp Key
        </Link>
      )}
      {isTotpSet && !verifyMode && (
        <Link className={styles.resetLink} onClick={handleToggleVerifyMode}>
          Verify Totp
        </Link>
      )}
    </Card>
  );
};

export default Totp;

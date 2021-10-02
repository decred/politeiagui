import React from "react";
import styles from "./Totp.module.css";
import { H2, P, CopyableText } from "pi-ui";

const SetTotp = ({ totp = {}, isAlreadySet }) =>
  !isAlreadySet ? (
    <div className="margin-bottom-m" data-testid="totp-set-wrapper">
      <H2>Set Two-Factor Authentication</H2>
      <div className={styles.setContainer}>
        <div className={styles.qrcode}>
          {totp.image && (
            <img src={`data:image/png;base64, ${totp.image}`} alt={totp.key} />
          )}
        </div>
        <div className={styles.instructions}>
          <P>
            You can activate the 2FA on your account following the instructions
            below. Once you activate the 2FA on your account,{" "}
            <b>
              you'll be required to inform your code every time you attempt to
              login.
            </b>
          </P>
          <P>You will be able deactivate the 2FA after you setup the keys.</P>
          <P>
            1 - <b>Save the backup key below</b>. If you did not write down or
            copy this backup key during 2FA setup, there's no way for you to
            view it later.
          </P>
          <div className={styles.copyableKey}>
            {totp.key && <CopyableText id="totp-key">{totp.key}</CopyableText>}
          </div>
          <P>
            2 - Scan the QR Code with a TOTP Authenticator{" "}
            <span className={styles.totpAuthenticators}>
              (Authy, Google Authenticator, FreeOTP, YubiKey, etc)
            </span>
          </P>
          <P>
            3 - Verify the 6-numbers code given by the authenticator using the
            input below to activate the 2FA
          </P>
        </div>
      </div>
    </div>
  ) : (
    <div className="margin-bottom-m">
      <H2>Two-Factor Authentication</H2>
      <P>You have enabled the Two-Factor Authentication in your account.</P>
    </div>
  );

export default SetTotp;

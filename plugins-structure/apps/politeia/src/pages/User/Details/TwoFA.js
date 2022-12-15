import React from "react";
import { Card, CopyableText, P, Text } from "pi-ui";
import UserDetails from "./Details";
import styles from "./styles.module.css";
import { me, totp } from "./_mock";
import { DigitsInput, RecordForm, SubmitButton } from "@politeiagui/common-ui";

const QrCode = ({ image, totpKey }) => {
  return <img src={`data:image/png;base64, ${image}`} alt={totpKey} />;
};

const Instructions = ({ totpKey }) => (
  <div className={styles.instructions}>
    <P>
      You can activate 2FA on your account by following the instructions below.
      Once you activate 2FA on your account,{" "}
      <b>you'll be required to enter your code every time you login.</b>
    </P>
    <P>You will be able to deactivate the 2FA after you setup the keys.</P>
    <P>
      1 - <b>Save the backup key below</b>. If you did not write down or copy
      this backup key during 2FA setup, there's no way for you to view it later.
    </P>
    {totpKey && <CopyableText id="totp-key">{totpKey}</CopyableText>}
    <P>
      2 - Scan the QR Code with a TOTP Authenticator{" "}
      <Text color="gray">
        (Authy, Google Authenticator, FreeOTP, YubiKey, etc)
      </Text>
    </P>
    <P>
      3 - Verify the 6-numbers code given by the authenticator using the input
      below to activate the 2FA
    </P>
  </div>
);

function User2FA() {
  const isVerified = me.totpverified;
  const label = isVerified ? "Reset" : "Verify";

  function handleSubmit(values) {
    if (isVerified) {
      console.log("Reset...", values);
    } else {
      console.log("Verify...", values);
    }
  }

  return (
    <UserDetails>
      {!isVerified ? (
        <Card className={styles.userCard}>
          <Text color="gray" weight="semibold">
            Set Two-Factor Authentication
          </Text>
          <div className={styles.totp}>
            <QrCode image={totp.image} totpKey={totp.key} />
            <Instructions totpKey={totp.key} />
          </div>
        </Card>
      ) : null}
      <Card className={styles.userCard}>
        {/* TODO: Validate Form */}
        <RecordForm
          className={styles.reset}
          formClassName={styles.form}
          onSubmit={handleSubmit}
          initialValues={{ code: "" }}
        >
          <Text color="gray" weight="semibold">
            {label} Code
          </Text>
          <div>
            <DigitsInput length={6} name="code" />
            <SubmitButton>{label}</SubmitButton>
          </div>
        </RecordForm>
      </Card>
    </UserDetails>
  );
}

export default User2FA;

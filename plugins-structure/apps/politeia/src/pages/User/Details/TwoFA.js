import React from "react";
import { CopyableText } from "pi-ui";
import UserDetails from "./Details";
import styles from "./styles.module.css";
import {
  DigitsInput,
  MarkdownRenderer,
  RecordForm,
  SubmitButton,
  useToast,
} from "@politeiagui/common-ui";
import { InfoCard } from "../../../components";
import instructions from "../../../assets/copies/2fa-instructions.md";
// MOCKS
import { me, totp } from "./_mock";

const QrCode = ({ image, totpKey }) => {
  return <img src={`data:image/png;base64, ${image}`} alt={totpKey} />;
};

function User2FA() {
  const { openToast } = useToast();
  const isVerified = me.totpverified;
  const label = isVerified ? "Reset" : "Verify";

  function handleSubmit(values) {
    console.log("Submit code", values);
    if (isVerified) {
      openToast({
        title: "User Two-Factor Authentication Reset",
        body: "You have successfully disabled the Two-Factor Authentication for your account",
        kind: "success",
      });
    } else {
      openToast({
        title: "User Two-Factor Authentication",
        body: "You have successfully set up Two-Factor Authentication for your account",
        kind: "success",
      });
    }
  }

  return (
    <UserDetails>
      <InfoCard
        title="Set Two-Factor Authentication"
        hide={isVerified}
        data-testid="user-2fa-set"
      >
        <div className={styles.totp}>
          <QrCode image={totp.image} totpKey={totp.key} />
          <MarkdownRenderer
            className={styles.instructions}
            body={instructions}
          />
        </div>
      </InfoCard>
      <InfoCard
        title="Backup Code"
        hide={isVerified}
        data-testid="user-2fa-backup"
      >
        <CopyableText id="totp-key">{totp.key}</CopyableText>
      </InfoCard>
      <InfoCard title={`${label} Code`} data-testid="user-2fa-code">
        <RecordForm
          className={styles.reset}
          formClassName={styles.form}
          onSubmit={handleSubmit}
          initialValues={{ code: "" }}
        >
          <div>
            <DigitsInput length={6} name="code" autoFocus />
            <SubmitButton>{label}</SubmitButton>
          </div>
        </RecordForm>
      </InfoCard>
    </UserDetails>
  );
}

export default User2FA;

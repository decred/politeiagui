import React from "react";
import { CopyableText } from "pi-ui";
import UserDetails from "./Details";
import styles from "./styles.module.css";
import { me, totp } from "./_mock";
import {
  DigitsInput,
  MarkdownRenderer,
  RecordForm,
  SubmitButton,
} from "@politeiagui/common-ui";
import { InfoCard } from "../../../components";
import instructions from "../../../assets/copies/2fa-instructions.md";

const QrCode = ({ image, totpKey }) => {
  return <img src={`data:image/png;base64, ${image}`} alt={totpKey} />;
};

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
      <InfoCard title="Set Two-Factor Authentication" hide={isVerified}>
        <div className={styles.totp}>
          <QrCode image={totp.image} totpKey={totp.key} />
          <MarkdownRenderer
            className={styles.instructions}
            body={instructions}
          />
        </div>
      </InfoCard>
      <InfoCard title="Backup Code" hide={isVerified}>
        <CopyableText id="totp-key">{totp.key}</CopyableText>
      </InfoCard>
      <InfoCard title={`${label} Code`}>
        <RecordForm
          className={styles.reset}
          formClassName={styles.form}
          onSubmit={handleSubmit}
          initialValues={{ code: "" }}
        >
          <div>
            <DigitsInput length={6} name="code" />
            <SubmitButton>{label}</SubmitButton>
          </div>
        </RecordForm>
      </InfoCard>
    </UserDetails>
  );
}

export default User2FA;

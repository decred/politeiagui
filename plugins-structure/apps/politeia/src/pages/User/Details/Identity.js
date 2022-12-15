import React from "react";
import { Button, Card, Link, Text } from "pi-ui";
import UserDetails from "./Details";
import styles from "./styles.module.css";

const Label = ({ text }) => (
  <Text weight="semibold" color="gray">
    {text}
  </Text>
);

const TextHighlighted = ({ text }) => (
  <Text
    backgroundColor="blueLighter"
    monospace
    className={styles.textHighlight}
  >
    {text}
  </Text>
);

const TextUuidMessage = () => (
  <span>
    <Text>
      Unique 16-byte UUID, as defined in{" "}
      <Link
        target="_blank"
        href="https://tools.ietf.org/html/rfc4122"
        rel="noreferrer"
      >
        RFC 4122
      </Link>
      , used to identify your user.
    </Text>
  </span>
);

function UserIdentity({ userid }) {
  const pubkey = "MOCK-810c5396d21e1b43ccc1cb796ee68bcc";
  return (
    <UserDetails>
      <Card className={styles.userCard}>
        <Label text="Public Key" />
        <Text>
          Your public and private keys constitute your identity. The private key
          is used to sign your proposals, comments and any up/down votes on
          Politeia. You can have only one identity active at a time. Your keys
          are stored in your browser by default, so if you use Politeia on
          multiple machines you will need to import your keys before you can
          participate.
        </Text>
        <TextHighlighted text={pubkey} />
        <div>
          <Button size="sm">Create new Identity</Button>
          <Button size="sm">Import Identity</Button>
          <Button size="sm">Download Identity</Button>
        </div>
      </Card>
      <Card className={styles.userCard}>
        <Label text="Past Public Keys" />
        <Text>
          List of inactive public keys your account has had in the past.
        </Text>
        <Button size="sm">Show All</Button>
      </Card>
      <Card className={styles.userCard}>
        <Label text="User ID" />
        <TextUuidMessage />
        <TextHighlighted text={userid} />
      </Card>
    </UserDetails>
  );
}

export default UserIdentity;

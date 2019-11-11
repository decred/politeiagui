import React from "react";
import { P, Text } from "pi-ui";

export default ({ pubkey }) =>
  pubkey ? (
    <P className="margin-top-s margin-bottom-s">
      <Text backgroundColor="blueLighter" monospace>
        {pubkey}
      </Text>
    </P>
  ) : (
    <P className="margin-top-s">There isn't an active public key</P>
  );

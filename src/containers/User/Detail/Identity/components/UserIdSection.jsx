import React from "react";
import { classNames, Text, P } from "pi-ui";
import styles from "../Identity.module.css";

export default ({ id }) =>
  <>
    <Text
        weight="semibold"
        className={classNames(
          styles.block,
          styles.fieldHeading,
          "margin-bottom-s",
          "margin-top-l"
        )}
      >
        User ID
      </Text>
      <P className="margin-bottom-s">
        Unique 16-byte UUID, as defined in{" "}
        <a href="http://tools.ietf.org/html/rfc4122">RFC 4122</a>, used to
        identify your user.
      </P>
      <Text backgroundColor="blueLighter" monospace>
        {id}
      </Text>
  </>;

import React from "react";
import { classNames, Text, P, Link } from "pi-ui";
import styles from "../Identity.module.css";

export default ({ id }) => (
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
      <Link
        href="https://tools.ietf.org/html/rfc4122"
        target="_blank"
        rel="nofollow noopener noreferrer"
      >
        RFC 4122
      </Link>
      , used to identify your user.
    </P>
    <Text backgroundColor="blueLighter" monospace>
      {id}
    </Text>
  </>
);

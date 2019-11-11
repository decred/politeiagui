import { classNames, Text } from "pi-ui";
import PropTypes from "prop-types";
import React, { memo } from "react";
import styles from "../Identity.module.css";

const IdentityList = memo(({ identities }) => {
  return (
    <ol className={classNames(styles.identityList, "margin-bottom-s")}>
      {identities.map(identity => (
        <li className="margin-top-l" key={identity.pubkey}><Text backgroundColor="blueLighter" monospace>{identity.pubkey}</Text></li>
      ))}
    </ol>
  );
});

IdentityList.propTypes = {
  identities: PropTypes.array
};

export default IdentityList;

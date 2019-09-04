import { classNames, Text } from "pi-ui";
import PropTypes from "prop-types";
import React from "react";
import styles from "./Identity.module.css";

const IdentityList = ({ identities, full }) => {
  return (
    <ol className={classNames(styles.identityList, "margin-bottom-s")}>
      {full ? identities.map(identity => (
        <li className="margin-top-l" key={identity.pubkey}><Text backgroundColor="blueLighter" monospace>{identity.pubkey}</Text></li>
      )) :
        identities.slice(0, 3).map(identity => (
          <li className="margin-top-l" key={identity.pubkey}><Text backgroundColor="blueLighter" monospace>{identity.pubkey}</Text></li>
        ))
      }
    </ol>
  );
};

IdentityList.propTypes = {
  identities: PropTypes.array,
  full: PropTypes.bool
};

export default IdentityList;

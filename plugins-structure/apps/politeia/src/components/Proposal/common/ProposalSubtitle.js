import React from "react";
import { Dropdown, DropdownItem, Link, Text } from "pi-ui";
import { Event, Join } from "@politeiagui/common-ui";
import range from "lodash/range";
import styles from "./styles.module.css";

function ProposalSubtitle({
  userid,
  username,
  token,
  version,
  timestamps = {},
  onChangeVersion,
}) {
  const { publishedat, editedat, expireat } = timestamps;
  return (
    <Join>
      <Link href={`user/${userid}`}>{username}</Link>
      {expireat && (
        <Event
          event={Date.now() > expireat * 1000 ? "expired" : "expires"}
          timestamp={expireat}
        />
      )}
      {publishedat && <Event event="published" timestamp={publishedat} />}
      {editedat && <Event event="edited" timestamp={editedat} />}
      {version > 1 &&
        (onChangeVersion ? (
          <Dropdown
            id={`proposal-${token}-version`}
            title={`version ${version}`}
            itemsListClassName={styles.version}
            dropdownHeaderClassName={styles.version}
            className={styles.version}
          >
            {range(version, 0, -1).map((v, i) => (
              <DropdownItem key={i} onClick={() => onChangeVersion(v)}>
                version {v}
              </DropdownItem>
            ))}
          </Dropdown>
        ) : (
          <Text
            id={`proposal-${token}-version`}
            truncate
            className={styles.version}
          >{`version ${version}`}</Text>
        ))}
    </Join>
  );
}

export default ProposalSubtitle;

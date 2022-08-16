import React from "react";
import { Dropdown, DropdownItem, Link, Text } from "pi-ui";
import { Event, Join } from "@politeiagui/common-ui";
import range from "lodash/range";
import styles from "./styles.module.css";

function RfpLinkedProposal({ name, link }) {
  return (
    !!name &&
    !!link && (
      <span className={styles.rfpProposalLabel} data-testid="proposal-rfp-link">
        Proposed for:{" "}
        <a data-link href={link} className={styles.rfpProposalLink}>
          {name}
        </a>
      </span>
    )
  );
}

function ProposalSubtitle({
  userid,
  username,
  token,
  version,
  timestamps = {},
  onChangeVersion,
  rfpLink = {},
}) {
  const { publishedat, editedat, expireat } = timestamps;
  return (
    <div>
      <RfpLinkedProposal name={rfpLink.name} link={rfpLink.link} />
      <Join className={styles.proposalSubtitle}>
        <Link href={`user/${userid}`} data-testid="proposal-username">
          {username}
        </Link>
        {expireat && (
          <Event
            event={Date.now() > expireat * 1000 ? "expired" : "expires"}
            data-testid="proposal-date-expire"
            timestamp={expireat}
          />
        )}
        {publishedat && (
          <Event
            event="published"
            data-testid="proposal-date-published"
            timestamp={publishedat}
          />
        )}
        {editedat && (
          <Event
            event="edited"
            data-testid="proposal-date-edited"
            timestamp={editedat}
          />
        )}
        {version > 1 &&
          (onChangeVersion ? (
            <Dropdown
              id={`proposal-${token}-version`}
              title={`version ${version}`}
              itemsListClassName={styles.version}
              dropdownHeaderClassName={styles.version}
              className={styles.version}
              data-testid="proposal-version"
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
    </div>
  );
}

export default ProposalSubtitle;

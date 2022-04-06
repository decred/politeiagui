import React from "react";
import { Dropdown, DropdownItem, Link, Text } from "pi-ui";
import { Event, Join } from "@politeiagui/common-ui";
import range from "lodash/range";

function ProposalSubtitle({
  userid,
  username,
  publishedat,
  editedat,
  token,
  version,
  onChangeVersion,
}) {
  return (
    <Join>
      <Link href={`user/${userid}`}>{username}</Link>
      {publishedat && <Event event="published" timestamp={publishedat} />}
      {editedat && <Event event="edited" timestamp={editedat} />}
      {version > 1 &&
        (onChangeVersion ? (
          <Dropdown
            id={`proposal-${token}-version`}
            title={`version ${version}`}
          >
            {range(version, 0, -1).map((v, i) => (
              <DropdownItem
                key={i}
                onClick={() => v !== version && onChangeVersion(v)}
              >
                version {v}
              </DropdownItem>
            ))}
          </Dropdown>
        ) : (
          <Text
            id={`proposal-${token}-version`}
            truncate
          >{`version ${version}`}</Text>
        ))}
    </Join>
  );
}

export default ProposalSubtitle;

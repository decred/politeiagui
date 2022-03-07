import React from "react";
import { Link, Text } from "pi-ui";
import { Event, Join } from "@politeiagui/common-ui";

function ProposalSubtitle({
  userid,
  username,
  publishedat,
  editedat,
  token,
  version,
}) {
  return (
    <Join>
      <Link href={`user/${userid}`}>{username}</Link>
      {publishedat && <Event event="published" timestamp={publishedat} />}
      {editedat && <Event event="edited" timestamp={editedat} />}
      {version > 1 && (
        <Text
          id={`proposal-${token}-version`}
          truncate
        >{`version ${version}`}</Text>
      )}
    </Join>
  );
}

export default ProposalSubtitle;

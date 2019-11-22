import React from "react";
import { DateTooltip } from "snew-classic-ui";
import { Link } from "../../snew";
import {
  CMS_DOMAINS,
  CMS_USER_TYPES
} from "../../../constants";

import { typesForDCC } from "../helpers";

const CardDCC = ({
  dccpayload,
  sponsoruserid,
  sponsorusername,
  censorshiprecord: { token },
  timestamp,
  nomineeusername
}) => {
  const { type, domain, contractortype } = dccpayload;

  return (
    <div className={`thing thing-proposal id-${token} odd link`}>
      <span
        className="title"
        style={{ display: "flex", overflow: "visible" }}
      >
        <Link className="title may-blank loggedin" href={`/dcc/${token}`}>
          {type && <span>{typesForDCC[type]} for {nomineeusername}</span>}
        </Link>
      </span>
      <span
        style={{ display: "flex", flexDirection: "column" }}
        className="tagline"
      >
        {domain && (
          <span>{CMS_DOMAINS[domain].toLocaleLowerCase()} - {contractortype && CMS_USER_TYPES[contractortype].toLocaleLowerCase()}</span>
        )}
        <span className="submitted-by">
          {sponsorusername && (
            <span>
              {" by "}
              <Link href={`/user/${sponsoruserid}`}>{sponsorusername}</Link>
            </span>
          )}
        </span>
        {timestamp && (
          <span className="submitted-by">
            {"submitted "}
            <DateTooltip createdAt={timestamp} />
          </span>
        )}
      </span>
    </div>
  );
};

export default CardDCC;

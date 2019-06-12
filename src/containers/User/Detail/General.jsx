import React from "react";
import PropTypes from "prop-types";
import { Link } from "pi-ui";
import InfoSection from "./InfoSection.jsx";
import { getUserActivePublicKey, isUserEmailVerified, hasUserPaid, isUserLocked } from "./helpers";
import { convertAtomsToDcr, formatUnixTimestamp } from "../../../utilsv2";

const General = ({
  proposalcredits,
  identities,
  newuserverificationtoken,
  newuserpaywalltx,
  newuserpaywalladdress,
  newuserpaywallamount,
  newuserpaywalltxnotbefore,
  failedloginattempts,
  islocked
}) => (
    <>
      <InfoSection label="Proposal Credits:" info={proposalcredits} />
      <InfoSection label="Your public key:" info={getUserActivePublicKey(identities)} />
      <InfoSection label="Verified email:" info={isUserEmailVerified(newuserverificationtoken)} />
      <InfoSection label="Password:" info={<Link href="#">Change Password</Link>} />
      <InfoSection label="Has paid:" info={hasUserPaid(newuserpaywalltx)} />
      <InfoSection label="Address:" info={newuserpaywalladdress} />
      <InfoSection label="Amount:" info={`${convertAtomsToDcr(newuserpaywallamount)} DCR`} />
      <InfoSection label="Pay after:" info={formatUnixTimestamp(newuserpaywalltxnotbefore)} />
      <InfoSection label="Failed login attempts:" info={failedloginattempts} />
      <InfoSection label="Locked:" info={isUserLocked(islocked)} />
    </>
  );

General.propTypes = {
  proposalcredits: PropTypes.string,
  identities: PropTypes.array,
  newuserverificationtoken: PropTypes.any,
  newuserpaywalltx: PropTypes.string,
  newuserpaywalladdress: PropTypes.string,
  newuserpaywallamount: PropTypes.number,
  newuserpaywalltxnotbefore: PropTypes.number,
  failedloginattempts: PropTypes.number,
  islocked: PropTypes.bool
};

export default General;

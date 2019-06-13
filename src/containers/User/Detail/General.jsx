import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "pi-ui";
import InfoSection from "./InfoSection.jsx";
import { getUserActivePublicKey, isUserEmailVerified, hasUserPaid, isUserLocked } from "./helpers";
import { convertAtomsToDcr, formatUnixTimestamp } from "src/utilsv2";
import ModalChangePassword from "src/componentsv2/ModalChangePassword";
import { useChangePassword } from "./hooks";

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
}) => {

  // Change Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const openPasswordModal = () => setShowPasswordModal(true);
  const closePasswordModal = () => setShowPasswordModal(false);
  const { onChangePassword, validationSchema } = useChangePassword();

  return (
    <>
      <InfoSection label="Proposal Credits:" info={proposalcredits} />
      <InfoSection label="Your public key:" info={getUserActivePublicKey(identities)} />
      <InfoSection label="Verified email:" info={isUserEmailVerified(newuserverificationtoken)} />
      <InfoSection label="Password:" info={<Link href="#" onClick={openPasswordModal}>Change Password</Link>} />
      <InfoSection label="Has paid:" info={hasUserPaid(newuserpaywalltx)} />
      <InfoSection label="Address:" info={newuserpaywalladdress} />
      <InfoSection label="Amount:" info={`${convertAtomsToDcr(newuserpaywallamount)} DCR`} />
      <InfoSection label="Pay after:" info={formatUnixTimestamp(newuserpaywalltxnotbefore)} />
      <InfoSection label="Failed login attempts:" info={failedloginattempts} />
      <InfoSection label="Locked:" info={isUserLocked(islocked)} />
      <ModalChangePassword onChangePassword={onChangePassword} validationSchema={validationSchema} show={showPasswordModal} onClose={closePasswordModal} />
    </>
  );
};

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

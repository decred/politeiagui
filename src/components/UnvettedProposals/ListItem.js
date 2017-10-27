import React from "react";
import { Link } from "react-router-dom";
import { getProposalStatus } from "../../helpers";
import { PROPOSAL_STATUS_CENSORED, PROPOSAL_STATUS_PUBLIC, PROPOSAL_STATUS_UNREVIEWED } from "../../constants";

const UnvettedListItem = ({
  name,
  status,
  censorshiprecord: {
    token,
  },
  onSubmitStatusProposal,
}) => (
  <tr>
    <td><Link to={`/proposals/${token}`}>{name}</Link></td>
    <td>{getProposalStatus(status)}</td>
    <td><Link to={`/proposals/${token}`}>{token.substring(0, 7) + "..."}</Link></td>
    {status === PROPOSAL_STATUS_UNREVIEWED ? (
      <td>
        <button onClick={() => onSubmitStatusProposal(token, PROPOSAL_STATUS_CENSORED)}>Censored</button>
        <button onClick={() => onSubmitStatusProposal(token, PROPOSAL_STATUS_PUBLIC)}>Publish</button>
      </td>
    ) : <td></td>}

  </tr>
);

export default UnvettedListItem;

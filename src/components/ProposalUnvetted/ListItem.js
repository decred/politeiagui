import React from "react";
import { Link } from "react-router-dom";
import { getProposalStatus } from "../../helpers";

const UnvettedListItem = ({
  name,
  status,
  censorshiprecord: {
    token,
  },
  onSubmitStatusProposal,
}) => (
  <tr>
    <td><Link to={`/proposals/${token}/status`}>{name}</Link></td>
    <td>{getProposalStatus(status)}</td>
    <td><Link to={`/proposals/${token}/status`}>{token.substring(0, 7) + "..."}</Link></td>
    {status == 2 ? (
      <td>
        <button onClick={() => onSubmitStatusProposal(token, 3)}>Censored</button>
        <button onClick={() => onSubmitStatusProposal(token, 4)}>Publish</button>
      </td>
    ) : <td></td>}

  </tr>
);

export default UnvettedListItem;

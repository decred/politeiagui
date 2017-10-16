import React from "react";
import { Link } from "react-router-dom";
import { getProposalStatus } from "../../helpers";

const UnvettedListItem = ({
  name,
  status,
  censorshiprecord: {
    token,
  },
}) => (
  <tr>
    <td><Link to={`/proposals/${token}/status`}>{name}</Link></td>
    <td>{getProposalStatus(status)}</td>
    <td><Link to={`/proposals/${token}/status`}>{token}</Link></td>
  </tr>
);

export default UnvettedListItem;

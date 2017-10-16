import React from "react";
import { getProposalStatus } from "../../helpers";

const UnvettedListItem = ({
  name,
  status,
  censorshiprecord: {
    token,
  },
}) => (
  <tr>
    <td>{name}</td>
    <td>{getProposalStatus(status)}</td>
    <td>{token}</td>
  </tr>
);

export default UnvettedListItem;

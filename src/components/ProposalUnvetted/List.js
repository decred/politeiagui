import React from "react";
import { map } from "lodash";
import ProposalListItem from "./ListItem";

const UnvettedList = ({
  proposals,
  onSubmitStatusProposal,
}) => (
  <table>
    <thead>
      <tr>
        <th>Proposal name</th>
        <th>Status</th>
        <th>Censorship token</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {map(proposals, (proposal, key) => (
        <ProposalListItem
          {...proposal}
          key={key}
          onSubmitStatusProposal={onSubmitStatusProposal} />
      ))}
    </tbody>
  </table>
);

export default UnvettedList;

import React from "react";
import UserDetails from "./Details";
import { ProposalsListMultipleVoteInventory } from "../../../components";

function UserProposals() {
  return (
    <UserDetails tab={"proposals"}>
      <ProposalsListMultipleVoteInventory statuses={["unauthorized"]} />
    </UserDetails>
  );
}

export default UserProposals;

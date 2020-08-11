import get from "lodash/get";
import includes from "lodash/includes";
import find from "lodash/find";

export const typeOptions = [
  "No type defined",
  "Direct",
  "Supervisor",
  "Sub Contractor",
  "Nominee",
  "Revoked",
  "Temp. Contractor",
  "Revoked Temp.",
  "Proposal Approved"
];

export const selectTypeOptions = typeOptions.map((op, idx) => ({
  value: idx,
  label: op
}));

export const getOwnedProposals = (owned, proposalsByToken) =>
  owned ? owned.map((token) => get(proposalsByToken, [token, "name"])) : [];

export const getInitialAndOptionsProposals = (proposals, proposalsowned) => {
  const proposalsOptions = [];
  const initialOwnedProposals = [];

  for (const {
    name,
    censorshiprecord: { token }
  } of proposals) {
    const value = { label: name, value: token };
    if (includes(proposalsowned, token)) {
      initialOwnedProposals.push(value);
    } else {
      proposalsOptions.push(value);
    }
  }

  return {
    proposalsOptions,
    initialOwnedProposals
  };
};

export const getInitialAndOptionsSupervisors = (
  supervisors,
  userSupervisors
) => {
  const supervisorsOptions = [];
  const initialSupervisorOptions = [];

  for (const { username, id } of supervisors) {
    const value = { label: username, value: id };
    if (includes(userSupervisors, id)) {
      initialSupervisorOptions.push(value);
    } else {
      supervisorsOptions.push(value);
    }
  }

  return {
    supervisorsOptions,
    initialSupervisorOptions
  };
};

export const getSupervisorsNames = (supervisors, userSupervisors) =>
  userSupervisors.flatMap((id) => {
    const user = find(supervisors, { id });
    return user ? user.username : [];
  });

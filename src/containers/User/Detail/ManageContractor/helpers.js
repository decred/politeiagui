import { get } from "lodash";

export const typeOptions = [
  "No type defined",
  "Direct",
  "Supervisor",
  "Sub Contractor",
  "Nominee",
  "Revoked",
  "Temp. Contractor",
  "Revoked Temp."
];

export const domainOptions = [
  "No domain defined",
  "Development",
  "Marketing",
  "Design",
  "Research",
  "Documentation",
  "Community Management"
];

export const selectTypeOptions = typeOptions.map((op, idx) => ({
  value: idx,
  label: op
}));

export const selectDomainOptions = domainOptions.map((op, idx) => ({
  value: idx,
  label: op
}));

export const getSupervisorsOptions = (supervisors, currentUserID) =>
  supervisors &&
  Array.isArray(supervisors) &&
  supervisors
    .filter(({ id }) => id !== currentUserID)
    .map(({ username, id }) => ({
      label: username,
      value: id
    }));

export const getOwnedProposals = (owned, proposalsByToken) =>
  owned ? owned.map((token) => get(proposalsByToken, [token, "name"])) : [];

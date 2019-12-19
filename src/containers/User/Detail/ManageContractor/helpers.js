const typeOptions = [
  "No type defined",
  "Direct",
  "Supervisor",
  "Sub Contractor"
];

const domainOptions = [
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

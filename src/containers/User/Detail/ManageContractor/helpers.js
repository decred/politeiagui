export const typeOptions = [
  "No type defined",
  "Direct",
  "Supervisor",
  "Sub Contractor"
];

export const typeViewOptions = [
  "No type defined",
  "Direct",
  "Supervisor",
  "Sub Contractor",
  "Not a contractor",
  "Dormant",
  "Nominee"
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

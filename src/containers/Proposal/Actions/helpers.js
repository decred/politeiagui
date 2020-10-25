export const fullVoteParamObject = ({
  type,
  version,
  duration,
  quorumpercentage,
  passpercentage,
  token,
  parent
}) => ({
  token,
  version: +version,
  type,
  mask: 3,
  duration,
  quorumpercentage,
  passpercentage,
  options: [
    {
      id: "no",
      description: "Don't approve proposal",
      bit: 1
    },
    {
      id: "yes",
      description: "Approve proposal",
      bit: 2
    }
  ],
  parent
});

export function Results({ yes = 100, no = 100 } = {}) {
  return [
    {
      id: "yes",
      description: "Approve the proposal",
      votebit: 1,
      votes: yes
    },
    {
      id: "no",
      description: "Reject the proposal",
      votebit: 2,
      votes: no
    }
  ];
}

export function Summary({ results, status } = {}) {
  this.type = 2;
  this.status = status;
  this.duration = 1000;
  this.startblockheight = 660982;
  this.startblockhash =
    "0000002ff12c6a8e8ea7f087021594f75a063087f3f37372dff9daaab2aa7b5f";
  this.endblockheight = 661998;
  this.eligibletickets = 5234;
  this.quorumpercentage = 50;
  this.passpercentage = 1;
  this.results = new Results(results);
  this.bestblock = 782348;
}

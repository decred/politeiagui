import faker from "faker";

export function Results({ yes = 0, no = 0 } = {}) {
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

export function Summary({ results, status, type = 0 } = {}) {
  this.type = type;
  this.status = status;
  this.duration = type ? 1000 : 0;
  this.startblockheight = 0;
  this.startblockhash = type
    ? "0000002ff12c6a8e8ea7f087021594f75a063087f3f37372dff9daaab2aa7b5f"
    : "";
  this.endblockheight = type ? 400 : 0;
  this.eligibletickets = type ? 5234 : 0;
  this.quorumpercentage = type ? 50 : 0;
  this.passpercentage = type ? 1 : 0;
  this.results = type ? new Results(results) : 0;
  this.bestblock = 200;
}

export function Timestamp({ data } = {}) {
  this.data = JSON.stringify(data || { key: faker.random.word() });
  this.digest = faker.datatype.hexaDecimal(128, false, /[0-9a-z]/);
  this.txid = faker.datatype.hexaDecimal(64, false, /[0-9a-z]/);
  this.merkleroot = faker.datatype.hexaDecimal(64, false, /[0-9a-z]/);
  this.proofs = faker.random.arrayElements();
}

import faker from "faker";
export function Summary({ status } = {}) {
  this.status = status;
}

export function BillingStatusChanges({ token, status }) {
  this.signature = faker.datatype.hexaDecimal(128, false, /[0-9a-z]/);
  this.receipt = faker.datatype.hexaDecimal(128, false, /[0-9a-z]/);
  this.publickey = faker.datatype.hexaDecimal(64);
  this.timestamp = Date.now() / 1000;
  this.token = token;
  this.status = status;
}

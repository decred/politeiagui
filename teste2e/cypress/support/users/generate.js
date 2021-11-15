import faker from "faker";
import compose from "lodash/fp/compose";
import map from "lodash/fp/map";
import times from "lodash/fp/times";

export function User({
  isadmin = false,
  userid,
  email,
  username,
  paywalladdress,
  proposalcredits,
  paywalltxid,
  publickey,
  totpverified = false
} = {}) {
  this.isadmin = isadmin;
  this.userid = userid || faker.datatype.uuid();
  this.email = email || faker.internet.email();
  this.username = username || faker.internet.userName();
  this.proposalcredits = proposalcredits || faker.datatype.number(100);
  this.paywalladdress = paywalladdress || `Ts${faker.datatype.hexaDecimal(33)}`;
  this.paywalltxid =
    paywalltxid || faker.datatype.hexaDecimal(64, false, /[0-9a-z]/);
  this.publickey = publickey || faker.datatype.hexaDecimal(64);
  this.paywallamount = 10000000;
  this.paywalltxnotbefore = Date.now() / 1000 - 3600;
  this.lastlogintime = faker.time.recent() / 1000;
  this.sessionmaxage = 86400; // 1 day
  this.totpverified = totpverified;
}

export function UserAdmin(props = {}) {
  return new User({ ...props, isadmin: true });
}

export function UserUnpaid(props = {}) {
  return new User({
    ...props,
    paywallamount: 0,
    paywalladdress: "",
    paywalltxid: ""
  });
}

export function UserNoCredits(props = {}) {
  return new User({ ...props, proposalcredits: 0 });
}

export function UserTotp(props = {}) {
  return new User({ ...props, totpverified: true });
}

export function userByType(userType, props) {
  switch (userType) {
    case "admin":
      return UserAdmin(props);
    case "noCredits":
      return UserNoCredits(props);
    case "unpaid":
      return UserUnpaid(props);
    case "user":
      return User(props);
    case "totp":
      return UserTotp(props);
    case "noLogin":
      return {};
    default:
      return User(props);
  }
}

export function PaymentCredits({ spent = 0, unspent = 0 } = {}) {
  const makeCredits = compose(
    map(() => ({
      paywallid: 0,
      price: 0,
      datepurchased: Date.now() / 1000,
      txid: "created_by_e2e_mock_api"
    })),
    times
  );
  this.spentcredits = makeCredits(spent);
  this.unspentcredits = makeCredits(unspent);
}

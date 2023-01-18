import { faker } from "@faker-js/faker";

export function mockUser(userProps = {}) {
  return ({ email }) => ({
    isadmin: false,
    userid: faker.datatype.uuid(),
    email,
    username: faker.internet.userName(),
    publickey: faker.datatype.hexadecimal(64),
    paywalladdress: faker.datatype.hexadecimal(35),
    paywallamount: 0,
    paywalltxnotbefore: 1646242149,
    paywalltxid: "cleared_by_admin",
    proposalcredits: 10005,
    lastlogintime: 1672153482,
    sessionmaxage: 86400,
    totpverified: false,
    ...userProps,
  });
}

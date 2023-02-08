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
export function mockUserDetails(userProps = {}) {
  return () => ({
    user: {
      id: faker.datatype.uuid(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
      isadmin: false,
      newuserpaywalladdress: "",
      newuserpaywallamount: 0,
      newuserpaywalltx: "",
      newuserpaywalltxnotbefore: 0,
      newuserpaywallpollexpiry: 0,
      newuserverificationtoken: null,
      newuserverificationexpiry: 0,
      updatekeyverificationtoken: null,
      updatekeyverificationexpiry: 0,
      resetpasswordverificationtoken: null,
      resetpasswordverificationexpiry: 0,
      lastlogintime: 1667343851,
      failedloginattempts: 0,
      isdeactivated: false,
      islocked: false,
      identities: [
        {
          pubkey:
            "5c9f69c6c5254934d9c763ef4f8ff060ad881779b3f57ac5cca1144c55fe5cbb",
          isactive: true,
        },
      ],
      proposalcredits: 0,
      emailnotifications: 0,
      ...userProps,
    },
  });
}

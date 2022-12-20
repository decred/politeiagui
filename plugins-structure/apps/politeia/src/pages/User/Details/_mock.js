export const user = {
  id: "0612f387-3777-4003-8f40-87b183f89032",
  email: "admin@example.com",
  username: "admin",
  isadmin: true,
  newuserpaywalladdress: "Tsm72S8cD8iGjfEbmy8Dtzhni69b7k4H5u3",
  newuserpaywallamount: 10000000,
  newuserpaywalltx: "cleared_by_admin",
  newuserpaywalltxnotbefore: 1659726039,
  newuserpaywallpollexpiry: 0,
  newuserverificationtoken: null,
  newuserverificationexpiry: 0,
  updatekeyverificationtoken: null,
  updatekeyverificationexpiry: 0,
  resetpasswordverificationtoken: null,
  resetpasswordverificationexpiry: 0,
  lastlogintime: 1670531891,
  failedloginattempts: 0,
  isdeactivated: false,
  islocked: false,
  identities: [
    {
      pubkey:
        "4e0d248935f52b3f50a05fbbd5f127f49e9b684c9cc9c6ca8aa3947c35f09641",
      isactive: false,
    },
    {
      pubkey:
        "4e0d248935f52b3f50a05fbbd5f127f49e9b684c9cc9c6ca8aa3947c35f09641",
      isactive: false,
    },
    {
      pubkey:
        "4e0d248935f52b3f50a05fbbd5f127f49e9b684c9cc9c6ca8aa3947c35f09641",
      isactive: false,
    },
    {
      pubkey:
        "ef513bca01d4093b6e7a7d082a4113f10b0cad98afc816f1de0b3a9f32b00f47",
      isactive: true,
    },
  ],
  proposalcredits: 9994,
  emailnotifications: 0,
};

export const registration = {
  haspaid: false,
  paywalladdress: "",
  paywallamount: 0,
  paywalltxnotbefore: 0,
};

const mockCredits = (n = 10) =>
  Array(n)
    .fill("")
    .map((_, i) => ({
      paywallid: 2,
      price: 10000000,
      datepurchased: new Date(Date.now() - 1000 * (i % 20)) / 1000,
      txid: "transaction-id",
    }));

export const credits = {
  unspentcredits: mockCredits(500),
  spentcredits: mockCredits(),
};

export const paywall = {
  creditprice: 10000000,
  paywalladdress: "Tsm72S8cD8iGjfEbmy8Dtzhni69b7k4H5u3",
  paywalltxnotbefore: 1670868848,
};

export const totp = {
  key: "N7CVKC2BUHN2PX0X35CUQWU6YM44SYNO",
  image:
    "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",
};

export const me = {
  isadmin: true,
  userid: "0612f387-3777-4003-8f40-87b183f89032",
  email: "admin@example.com",
  username: "admin",
  publickey: "a42d159fb47426b2b0c2656d4144e784e3ae4d5c7cb84b4d4d3c8536ecefb698",
  paywalladdress: "TsRBnD2mnZX1upPMFNoQ1ckYr9Y4TZyuGTV",
  paywallamount: 0,
  paywalltxnotbefore: 1646242149,
  paywalltxid: "cleared_by_admin",
  proposalcredits: 9994,
  lastlogintime: 1671111771,
  sessionmaxage: 86400,
  totpverified: false,
};

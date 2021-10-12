import faker from "faker";

export function apiReply({ isActive = false }) {
  return {
    version: 1,
    route: "/v1",
    buildversion: "(devel)",
    pubkey: faker.datatype.hexaDecimal(64, false, /[0-9a-z]/),
    testnet: true,
    mode: "piwww",
    activeusersession: isActive
  };
}

export function policyReply() {
  return {
    minpasswordlength: 8,
    minusernamelength: 3,
    maxusernamelength: 30,
    usernamesupportedchars: [
      "a-z",
      "0-9",
      ".",
      ",",
      ":",
      ";",
      "-",
      "@",
      "+",
      "(",
      ")",
      "_"
    ],
    proposallistpagesize: 20,
    userlistpagesize: 20,
    maximages: 5,
    maximagesize: 524288,
    maxmds: 1,
    maxmdsize: 524288,
    validmimetypes: ["image/png", "text/plain", "text/plain; charset=utf-8"],
    minproposalnamelength: 8,
    maxproposalnamelength: 80,
    paywallenabled: true,
    proposalnamesupportedchars: [
      "A-z",
      "0-9",
      "&",
      ".",
      ",",
      ":",
      ";",
      "-",
      " ",
      "@",
      "+",
      "#",
      "/",
      "(",
      ")",
      "!",
      "?",
      '"',
      "'"
    ],
    maxcommentlength: 8000,
    backendpublickey: "",
    tokenprefixlength: 7,
    buildinformation: ["build info"],
    indexfilename: "index.md",
    minlinkbyperiod: 0,
    maxlinkbyperiod: 0,
    minvoteduration: 0,
    maxvoteduration: 0,
    paywallconfirmations: 2
  };
}

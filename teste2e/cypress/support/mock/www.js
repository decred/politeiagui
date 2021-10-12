import get from "lodash/fp/get";
import faker from "faker";
import { makeCustomUserSession } from "../generate";

export const middlewares = {
  api: (isActive = false) =>
    cy.intercept("/api", (req) => {
      req.reply({
        headers: { "x-csrf-token": "abcdefghijklmnopqrstuvwxyz" },
        body: {
          version: 1,
          route: "/v1",
          buildversion: "(devel)",
          pubkey: faker.datatype.hexaDecimal(64, false, /[0-9a-z]/),
          testnet: true,
          mode: "piwww",
          activeusersession: isActive
        }
      });
    }),
  policy: () =>
    cy.intercept("/api/v1/policy", (req) => {
      req.reply({
        body: {
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
          validmimetypes: [
            "image/png",
            "text/plain",
            "text/plain; charset=utf-8"
          ],
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
        }
      });
    }),
  login: ({ userType = "paid", error } = {}) =>
    cy.intercept("/api/v1/login", (req) => {
      if (error) {
        req.reply({
          statusCode: error.statusCode,
          body: { ErrorCode: error.errorCode }
        });
      } else {
        const { email } = req.body.params;
        req.reply({
          body: { ...makeCustomUserSession(userType), email }
        });
      }
    })
};

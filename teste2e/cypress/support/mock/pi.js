import {
  PROPOSAL_SUMMARY_STATUS_UNVETTED,
  PROPOSAL_SUMMARY_STATUS_UNVETTED_ABANDONED,
  PROPOSAL_SUMMARY_STATUS_UNVETTED_CENSORED,
  PROPOSAL_SUMMARY_STATUS_UNDER_REVIEW,
  PROPOSAL_SUMMARY_STATUS_ABANDONED,
  PROPOSAL_SUMMARY_STATUS_CENSORED,
  PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED,
  PROPOSAL_SUMMARY_STATUS_VOTE_STARTED,
  PROPOSAL_SUMMARY_STATUS_REJECTED,
  PROPOSAL_SUMMARY_STATUS_ACTIVE,
  PROPOSAL_SUMMARY_STATUS_COMPLETED,
  PROPOSAL_SUMMARY_STATUS_CLOSED
} from "../../utils";
import sample from "lodash/sample";
import faker from "faker";

const billingStatusByTab = {
  "Under Review": [
    PROPOSAL_SUMMARY_STATUS_UNDER_REVIEW,
    PROPOSAL_SUMMARY_STATUS_VOTE_AUTHORIZED,
    PROPOSAL_SUMMARY_STATUS_VOTE_STARTED
  ],
  Approved: [
    PROPOSAL_SUMMARY_STATUS_ACTIVE,
    PROPOSAL_SUMMARY_STATUS_COMPLETED,
    PROPOSAL_SUMMARY_STATUS_CLOSED
  ],
  Rejected: [PROPOSAL_SUMMARY_STATUS_REJECTED],
  Abandoned: [
    PROPOSAL_SUMMARY_STATUS_ABANDONED,
    PROPOSAL_SUMMARY_STATUS_CENSORED
  ],
  Unreviewed: [PROPOSAL_SUMMARY_STATUS_UNVETTED],
  Censored: [
    PROPOSAL_SUMMARY_STATUS_UNVETTED_ABANDONED,
    PROPOSAL_SUMMARY_STATUS_UNVETTED_CENSORED
  ]
};

export const middlewares = {
  setBillingStatus: ({ body = {}, statusCode = 200 } = {}) =>
    cy.intercept("/api/pi/v1/setbillingstatus", (req) =>
      req.reply({
        body,
        statusCode
      })
    ),
  summaries: ({ token, status = "", tab } = {}) =>
    cy.intercept("/api/pi/v1/summaries", (req) => {
      if (token) {
        req.reply({ body: { [token]: status } });
      } else {
        const tokens = req.body.tokens;
        const summaries = tokens.reduce(
          (acc, tkn) => ({
            ...acc,
            [tkn]: {
              status: tab ? sample(billingStatusByTab[tab]) || "" : status,
              reason: faker.lorem.sentence()
            }
          }),
          {}
        );
        req.reply({ body: { summaries } });
      }
    }),
  policy: () =>
    cy.intercept("/api/pi/v1/policy", (req) => {
      req.reply({
        body: {
          textfilesizemax: 524288,
          imagefilecountmax: 5,
          imagefilesizemax: 524288,
          namelengthmin: 8,
          namelengthmax: 80,
          namesupportedchars: [
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
          amountmin: 100,
          amountmax: 100000000,
          startdatemin: 604800,
          enddatemax: 31557600,
          domains: ["development", "marketing", "research", "design"]
        }
      });
    }),
  billingstatuschanges: ({ body = {}, statusCode = 200 } = {}) =>
    cy.intercept("/api/pi/v1/billingstatuschanges", (req) =>
      req.reply({
        body,
        statusCode
      })
    )
};

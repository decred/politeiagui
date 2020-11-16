import * as pki from "../src/lib/pki";

export const requestWithCsrfToken = (url, body) => {
  return cy.request("https://localhost:3000/api").then((res) => {
    return cy.request({
      url,
      body,
      method: "POST",
      encoding: "utf-8",
      headers: {
        "X-Csrf-Token": res.headers["x-csrf-token"]
      }
    });
  });
};

export const setProposalStatus = (proposal, status, censorMsg = "") => {
  return cy.request("api/v1/user/me").then((res) => {
    return pki.myPubKeyHex(res.body.userid).then((publickey) =>
      pki
        .signStringHex(res.body.userid, proposal.token + status + censorMsg)
        .then((signature) => {
          return requestWithCsrfToken(
            `/api/v1/proposals/${proposal.token}/status`,
            {
              proposalstatus: status,
              token: proposal.token,
              signature,
              publickey,
              statuschangemessage: censorMsg
            }
          );
        })
    );
  });
};

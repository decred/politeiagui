const GLOBAL_TIMEOUT = require("../constants").GLOBAL_TIMEOUT;
const Commands = {
  submitProposal: function () {
    return this
      .waitForElementVisible("@submitProposalLink", GLOBAL_TIMEOUT)
      .click("@submitProposalLink")
      .waitForElementVisible("@submitProposalPage", GLOBAL_TIMEOUT);
  },
};

module.exports = {
  commands: [Commands],
  url: function () {
    return this.api.launchUrl;
  },
  elements: {
    titleH1: ".page h1",
    proposals: ".sitetable.linklisting",
    proposalSchema: ".proposals-list li",
    menu: ".header nav",
    submitProposalLink: ".header nav .submit",
    submitProposalPage: ".page.proposal-submit-page",
  },
};

const Commands = {
  submitProposal: function() {
    return this.waitForElementVisible("@submitProposalLink", 10000)
      .click("@submitProposalLink")
      .waitForElementVisible("@submitProposalPage", 10000);
  }
};

module.exports = {
  commands: [Commands],
  url: function() {
    return this.api.launchUrl;
  },
  elements: {
    titleH1: ".page h1",
    proposals: ".sitetable.linklisting",
    proposalSchema: ".proposals-list li",
    menu: ".header nav",
    submitProposalLink: ".header nav .submit",
    submitProposalPage: ".page.proposal-submit-page"
  }
};

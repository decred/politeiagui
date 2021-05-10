const FAKE_USER = {
  email: "test@emai"
};

const FAKE_PUBKEY = "fake_pub_key";
const FAKE_CSRF = "fake_csrf_token";

export const MOCK_STATE = {
  api: {
    login: {
      payload: {
        email: "testlogin@email.com"
      }
    },
    newUser: {
      payload: {
        email: FAKE_USER.email
      },
      error: "errormsg"
    },
    manageUser: {
      payload: {
        action: "fake_action"
      }
    },
    changeUsername: {
      response: {
        username: "testusername2"
      }
    },
    vetted: {
      response: {
        proposals: [
          {
            name: "Interaction design investor validation social media hypotheses value proposition entrepreneur iteration partner network technology crowdsource research & development paradigm shift.",
            status: 0,
            numcomments: 3,
            timestamp: 1505940196,
            censorshiprecord: {
              token:
                "6284c5f8fba5665373b8e6651ebc8747b289fed242d2f880f64a284496bb4ca11",
              merkle:
                "0dd10219cd79342198085cbe6f737bd54efe119b24c84cbc053023ed6b7da4c8",
              signature:
                "f5ea17d547d8347a2f2d77edcb7e89fcc96613d7aaff1f2a26761779763d77688b57b423f1e7d2da8cd433ef2cfe6f58c7cf1c43065fa6716a03a3726d902d0a"
            },
            files: []
          },
          {
            name: "Beta release creative investor business-to-business incubator pivot user experience iPhone startup hackathon responsive web design pitch.",
            status: 2,
            numcomments: 3,
            timestamp: 1505940196,
            censorshiprecord: {
              token:
                "6284c5f8fba5665373b8e6651ebc8747b289fed242d2f880f64a284496bb4ca8",
              merkle:
                "0dd10219cd79342198085cbe6f737bd54efe119b24c84cbc053023ed6b7da4c8",
              signature:
                "f5ea17d547d8347a2f2d77edcb7e89fcc96613d7aaff1f2a26761779763d77688b57b423f1e7d2da8cd433ef2cfe6f58c7cf1c43065fa6716a03a3726d902d0a"
            },
            files: []
          }
        ]
      }
    },
    startVote: {
      isRequesting: true,
      payload: {
        token: "fake_token"
      }
    },
    setStatusProposal: {
      payload: {
        token: "fake_st_token"
      }
    },
    newProposal: {
      payload: {
        name: "fake_proposal_name",
        description: "fake_proposal_desc",
        files: ["file1", "file2"]
      }
    },
    proposal: {
      isRequesting: true
    },
    editProposal: {},
    forgottenPassword: {
      payload: {
        email: FAKE_USER.email
      }
    },
    resendVerificationEmail: {
      payload: {
        email: FAKE_USER.email
      }
    }
  },
  app: {
    init: {
      isRequesting: true,
      response: {
        csrfToken: FAKE_CSRF,
        testnet: true,
        pubkey: FAKE_PUBKEY
      },
      error: true
    },
    userPaywallStatus: 1,
    userPaywallConfirmations: 0,
    adminProposalsShow: 2,
    publicProposalsShow: 0,
    userProposalsShow: 1,
    csrfIsNeeded: true,
    proposalCredits: 2,
    pollingCreditsPayment: false,
    identityImportResult: {
      errorMsg: "invalid identity",
      successMsg: "successful identity"
    },
    draftProposals: {
      newDraft: {
        proposal: ""
      },
      lastSubmitted: {
        proposal: ""
      },
      originalName: {
        proposal: ""
      }
    },
    submittedProposals: {
      lastSubmitted: {}
    },
    draftInvoices: {
      newDraft: {
        invoice: ""
      }
    }
  },
  external_api: {
    payWithFaucet: {
      isRequesting: false,
      response: {
        txid: "fake_txid"
      },
      error: {
        msg: "fake_error"
      }
    },
    blockHeight: {
      isRequesting: false
    },
    payProposalWithFaucet: {
      error: {
        msg: "fake_error"
      }
    }
  }
};

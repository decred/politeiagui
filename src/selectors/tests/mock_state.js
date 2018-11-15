const FAKE_USER = {
  email: "test@emai"
};

const FAKE_PAYWALL = {
  address: "T_fake_address",
  amount: 1000000000,
  txNotBefore: "any"
};

const FAKE_PUBKEY = "fake_pub_key";
const FAKE_CSRF = "fake_csrf_token";
const FAKE_TOKEN = "fake_token";

const MOCK_USER_PROPS = [
  {
    name: "Proposal to mitigate risks regarding identity theft and forgery",
    status: 2,
    numcomments: 3,
    timestamp: 1505940194,
    censorshiprecord: {
      token:
        "6284c5f8fba5664453b8e6651ebc8747b289fed242d2f880f64a284496bb4ca11",
      merkle:
        "0dd10219cd79342166085cbe6f737bd54efe119b24c84cbc053023ed6b7da4c8",
      signature:
        "f5ea17d547d8347a2f2d009dcb7e89fcc96613d7aaff1f2a26761779763d77688b57b423f1e7d2da8cd433ef2cfe6f58c7cf1c43065fa6716a03a3726d902d0a"
    },
    files: [],
    userid: "fake_id"
  }
];

export const MOCK_STATE = {
  api: {
    user: {
      response: {
        user: "fake_user"
      }
    },
    userProposals: {
      response: {
        proposals: MOCK_USER_PROPS
      }
    },
    login: {
      response: {
        lastlogintime: "fake_login_time",
        isadmin: true,
        paywalladdress: ""
      },
      payload: {
        email: "testlogin@email.com"
      }
    },
    newUser: {
      payload: {
        email: FAKE_USER.email
      },
      response: {
        verificationtoken: "fake_ver_token",
        paywalladdress: FAKE_PAYWALL.address,
        paywallamount: FAKE_PAYWALL.amount,
        paywalltxnotbefore: FAKE_PAYWALL.txNotBefore
      },
      error: "errormsg"
    },
    manageUser: {
      payload: {
        action: "fake_action"
      }
    },
    userProposalCredits: {
      response: {
        spentcredits: [
          {
            txid: "fake_txid",
            paywallid: "fake_paywallid",
            price: 200000000,
            datepurchased: "fake_date"
          }
        ],
        unspentcredits: [
          {
            txid: "fake_txid2",
            paywallid: "fake_paywallid2",
            price: 400000000,
            datepurchased: "fake_date2"
          }
        ]
      }
    },
    me: {
      response: {
        email: "testme@email.com",
        username: "testusername",
        isadmin: true,
        userid: "fake_id",
        paywalladdress: FAKE_PAYWALL.address,
        paywallamount: FAKE_PAYWALL.amount,
        paywalltxnotbefore: FAKE_PAYWALL.txNotBefore,
        csrfToken: FAKE_CSRF,
        publickey: FAKE_PUBKEY
      }
    },
    changeUsername: {
      response: {
        username: "testusername2"
      }
    },
    init: {
      isRequesting: true,
      response: {
        csrfToken: FAKE_CSRF,
        testnet: true,
        pubkey: FAKE_PUBKEY
      },
      error: true
    },
    unvetted: {
      response: {
        proposals: [
          ...MOCK_USER_PROPS,
          {
            name: "This is an example proposal",
            status: 3,
            numcomments: 0,
            timestamp: 1505940196,
            censorshiprecord: {
              token:
                "6284c5f8fba5665373b8e6651ebc8747b289fed242d2f880f64a284496bb4ca9",
              merkle:
                "0dd10219cd79342198085cbe6f737bd54efe119b24c84cbc053023ed6b7da4c8",
              signature:
                "f5ea17d547d8347a2f2d77edcb7e89fcc96613d7aaff1f2a26761779763d77688b57b423f1e7d2da8cd433ef2cfe6f58c7cf1c43065fa6716a03a3726d902d0a"
            },
            files: []
          },
          {
            name: "This is a censored example proposal",
            status: 5,
            numcomments: 0,
            timestamp: 1505940196,
            censorshiprecord: {
              token:
                "6284c5f8fba5665373b8e6651ebc8747b289fed242d2f880f64a284496bb4ca9"
            },
            files: []
          }
        ]
      }
    },
    vetted: {
      response: {
        proposals: [
          {
            name:
              "Interaction design investor validation social media hypotheses value proposition entrepreneur iteration partner network technology crowdsource research & development paradigm shift.",
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
            name:
              "Beta release creative investor business-to-business incubator pivot user experience iPhone startup hackathon responsive web design pitch.",
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
      response: {
        startvote: "fake_date"
      },
      payload: {
        token: "fake_token"
      }
    },
    setStatusProposal: {
      payload: {
        token: "fake_st_token"
      },
      response: {
        status: "unvetted"
      }
    },
    newProposal: {
      payload: {
        name: "fake_proposal_name",
        description: "fake_proposal_desc",
        files: ["file1", "file2"]
      },
      response: {
        censorshiprecord: {
          merkle: "fake_mcsrecord",
          token: "fake_tcsrecord",
          signature: "fake_scsrecord"
        }
      }
    },
    proposal: {
      isRequesting: true,
      response: {
        proposal: {
          name: "fake_proposal_name",
          description: "fake_proposal_desc",
          isMarkdown: true,
          userid: 2,
          username: "fake_username",
          files: [
            {
              name: "index.md",
              payload: window.btoa("proposal's coded payload")
            }
          ],
          censorshiprecord: {
            token: FAKE_TOKEN
          }
        }
      }
    },
    editProposal: {
      response: {
        proposal: {
          censorshiprecord: {
            token: "fake_edit_cstoken"
          }
        }
      }
    },
    forgottenPassword: {
      payload: {
        email: FAKE_USER.email
      }
    },
    proposalPaywallDetails: {
      response: {
        paywalladdress: FAKE_PAYWALL.address,
        paywalltxnotbefore: FAKE_PAYWALL.txNotBefore,
        creditprice: 200000000
      }
    },
    proposalVoteStatus: {
      response: {
        token:
          "6284c5f8fba5665373b8e6651ebc8747b289fed242d2f880f64a284496bb4ca8"
      }
    },
    proposalsVoteStatus: {
      response: {
        votesstatus: [
          {
            token: "fake_token"
          },
          {
            token: "fake_token2"
          }
        ]
      }
    },
    proposalComments: {
      response: {
        comments: [
          {
            text: "comment",
            userid: 2
          },
          {
            text: "comment2",
            userid: 3
          }
        ]
      }
    },
    resendVerificationEmail: {
      payload: {
        email: FAKE_USER.email
      }
    }
  },
  app: {
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
    }
  },
  external_api: {
    payWithFaucet: {
      isRequesting: false,
      response: {
        Txid: "fake_txid"
      },
      error: {
        msg: "fake_error"
      }
    },
    blockHeight: {
      isRequesting: false
    },
    payProposalWithFaucet: {
      response: {
        Txid: "fake_txid"
      },
      error: {
        msg: "fake_error"
      }
    }
  }
};

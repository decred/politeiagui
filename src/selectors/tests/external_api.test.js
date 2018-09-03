import * as sel from "../external_api";


describe("test external_api selector", () => {

  const MOCK_STATE = {
    external_api: {
      payWithFaucet: {
        isRequesting: false,
        response: {
          Txid: "fake_txid"
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
          msg: "fake_msg"
        }
      }
    }
  };

  test("testing higher order selectors", () => {
    // isRequesting
    expect(sel.getIsApiRequesting("payWithFaucet")(MOCK_STATE))
      .toEqual(MOCK_STATE.external_api.payWithFaucet.isRequesting);


    // response

    // error
  });

  test("testing 'or' and composed selectors", () => {

    expect(sel.isApiRequestingPayWithFaucet(MOCK_STATE))
      .toEqual(false);

    MOCK_STATE.external_api.payWithFaucet.isRequesting = true;

    expect(sel.isApiRequestingPayWithFaucet(MOCK_STATE))
      .toEqual(true);

    MOCK_STATE.external_api.blockHeight.isRequesting   = true;
    MOCK_STATE.external_api.payWithFaucet.isRequesting = false;

    expect(sel.isApiRequestingPayWithFaucet(MOCK_STATE))
      .toEqual(true);

    MOCK_STATE.external_api.blockHeight.isRequesting   = false;
    MOCK_STATE.external_api.payWithFaucet.isRequesting = false;

    expect(sel.isApiRequestingPayWithFaucet(MOCK_STATE))
      .toEqual(false);

    expect(sel.payWithFaucetTxId(MOCK_STATE))
      .toEqual(MOCK_STATE.external_api.payWithFaucet.response.Txid);

    expect(sel.payProposalWithFaucetTxId(MOCK_STATE))
      .toEqual(MOCK_STATE.external_api.payProposalWithFaucet.response.Txid);


  });

});

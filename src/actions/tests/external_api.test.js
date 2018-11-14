import * as ea from "../external_api";
import * as act from "../types";
import fetchMock from "fetch-mock";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
  PAYWALL_STATUS_LACKING_CONFIRMATIONS,
  PAYWALL_STATUS_PAID
} from "../../constants";
import {
  setPostSuccessResponse,
  setGetSuccessResponse,
  setPostErrorResponse
} from "./helpers";

beforeEach(() => {
  //send status 200 to every unmatched request
  fetchMock.restore();
  // fetchMock.get("/", {}).catch({ status: 404 });
});

describe("test actions/external_api", () => {
  // const verifyResponseSuccess =
  const FAKE_ADDRESS = "TsUMTGNMHNqivWpWAbWHvPfoG5GuefF9zWt";
  const FAKE_TRANSACTION =
    "ed4bac11c56cb7a8ceb9dc03278c5abb3ff482e08597e4774e534107c7705f4d";
  const AMOUNT = 0.1;
  const FAKE_TX_NOT_BEFORE = "1527263799";

  const mockPiVerifyPaymentPath = "/api/v1/user/verifypayment";
  const mockDcrDataPath = `https://testnet.dcrdata.org/api/address/${FAKE_ADDRESS}/raw`;
  const mockInsightPath = `https://testnet.decred.org/api/addr/${FAKE_ADDRESS}/utxo?noCache=1`;
  const mockDcrDataResponseLackingConfirmation = [
    {
      size: 251,
      txid: "997a39549ed7ec5cb64f90753c6c69c6db8a84b06c2908cc0aea3c4a4d5e0805",
      version: 1,
      locktime: 0,
      vin: [
        {
          txid:
            "c3e91bc45c5db09c2163cb0e6bb3aaae03e5d0e6adcf02309b54a6cb02fa2f09",
          vout: 2,
          tree: 0,
          amountin: -1e-8,
          blockheight: 0,
          blockindex: 4294967295,
          scriptSig: {
            asm:
              "304402200205fcacfab0ece9104edad60fc320944e42f65ae891feb923d63788fc6e210302203f14f45f3a653ebb6269f96a4e474ee2b6cc4ecb684e94d260fc8af562f3c82201 02ae1f6b51086bd753f072f94eb8ffe6806d3570c088a3ede46c678b6ea47d1675",
            hex:
              "47304402200205fcacfab0ece9104edad60fc320944e42f65ae891feb923d63788fc6e210302203f14f45f3a653ebb6269f96a4e474ee2b6cc4ecb684e94d260fc8af562f3c822012102ae1f6b51086bd753f072f94eb8ffe6806d3570c088a3ede46c678b6ea47d1675"
          },
          prevOut: {
            addresses: ["TseH9wPe4bfRqS2qwceAyjzNGFrMAPgzkvB"],
            value: 4.07644788
          },
          sequence: 4294967295
        }
      ],
      vout: [
        {
          value: 2,
          n: 0,
          version: 0,
          scriptPubKey: {
            asm:
              "OP_DUP OP_HASH160 248ff72f88490b4f28ad79c9efea9bb698386753 OP_EQUALVERIFY OP_CHECKSIG",
            reqSigs: 1,
            type: "pubkeyhash",
            addresses: ["TsUMTGNMHNqivWpWAbWHvPfoG5GuefF9zWt"]
          }
        },
        {
          value: 2.07619488,
          n: 1,
          version: 0,
          scriptPubKey: {
            asm:
              "OP_DUP OP_HASH160 4b14e6575d8bfcba9d07e9b282d69082d623a0a5 OP_EQUALVERIFY OP_CHECKSIG",
            reqSigs: 1,
            type: "pubkeyhash",
            addresses: ["TsXs8C66i45x91LvWVhdUxxCFhdQSgUiDP2"]
          }
        }
      ],
      confirmations: 0,
      blockhash: ""
    }
  ];
  const mockDcrDataResponseComplete = [
    {
      size: 251,
      txid: "997a39549ed7ec5cb64f90753c6c69c6db8a84b06c2908cc0aea3c4a4d5e0805",
      version: 1,
      locktime: 0,
      vin: [
        {
          txid:
            "c3e91bc45c5db09c2163cb0e6bb3aaae03e5d0e6adcf02309b54a6cb02fa2f09",
          vout: 2,
          tree: 0,
          amountin: 4.07644788,
          blockheight: 268562,
          blockindex: 0,
          scriptSig: {
            asm:
              "304402200205fcacfab0ece9104edad60fc320944e42f65ae891feb923d63788fc6e210302203f14f45f3a653ebb6269f96a4e474ee2b6cc4ecb684e94d260fc8af562f3c82201 02ae1f6b51086bd753f072f94eb8ffe6806d3570c088a3ede46c678b6ea47d1675",
            hex:
              "47304402200205fcacfab0ece9104edad60fc320944e42f65ae891feb923d63788fc6e210302203f14f45f3a653ebb6269f96a4e474ee2b6cc4ecb684e94d260fc8af562f3c822012102ae1f6b51086bd753f072f94eb8ffe6806d3570c088a3ede46c678b6ea47d1675"
          },
          prevOut: {
            addresses: ["TseH9wPe4bfRqS2qwceAyjzNGFrMAPgzkvB"],
            value: 4.07644788
          },
          sequence: 4294967295
        }
      ],
      vout: [
        {
          value: 2,
          n: 0,
          version: 0,
          scriptPubKey: {
            asm:
              "OP_DUP OP_HASH160 248ff72f88490b4f28ad79c9efea9bb698386753 OP_EQUALVERIFY OP_CHECKSIG",
            reqSigs: 1,
            type: "pubkeyhash",
            addresses: ["TsUMTGNMHNqivWpWAbWHvPfoG5GuefF9zWt"]
          }
        },
        {
          value: 2.07619488,
          n: 1,
          version: 0,
          scriptPubKey: {
            asm:
              "OP_DUP OP_HASH160 4b14e6575d8bfcba9d07e9b282d69082d623a0a5 OP_EQUALVERIFY OP_CHECKSIG",
            reqSigs: 1,
            type: "pubkeyhash",
            addresses: ["TsXs8C66i45x91LvWVhdUxxCFhdQSgUiDP2"]
          }
        }
      ],
      confirmations: 2,
      blockhash:
        "00000000034fd860e3341a692a577d123a6957e0b6fd4ae4d68d4e57d6d4d0a4",
      time: 1527263888,
      blocktime: 1527263888
    }
  ];
  const mockStore = configureStore([thunk]);
  const store = mockStore({});

  test("test verify user payment action", async () => {
    const params = [FAKE_ADDRESS, AMOUNT, FAKE_TX_NOT_BEFORE];

    //mock dcr insight response
    setGetSuccessResponse(mockInsightPath, {}, []);

    //test with payment confirmed by the network
    setGetSuccessResponse(mockDcrDataPath, {}, mockDcrDataResponseComplete);

    //confirmed by networkt and verified by politeia
    setGetSuccessResponse(mockPiVerifyPaymentPath, {}, { haspaid: true });
    await store.dispatch(ea.verifyUserPayment.apply(null, params));
    expect(store.getActions()).toEqual([
      {
        type: act.UPDATE_USER_PAYWALL_STATUS,
        error: false,
        payload: { status: PAYWALL_STATUS_PAID }
      }
    ]);

    //test with lack of confirmation by the network
    store.clearActions();
    setGetSuccessResponse(
      mockDcrDataPath,
      {},
      mockDcrDataResponseLackingConfirmation
    );
    await store.dispatch(ea.verifyUserPayment.apply(null, params));
    expect(store.getActions()).toEqual([
      {
        type: act.UPDATE_USER_PAYWALL_STATUS,
        error: false,
        payload: {
          status: PAYWALL_STATUS_LACKING_CONFIRMATIONS,
          currentNumberOfConfirmations: 0,
          txid:
            "997a39549ed7ec5cb64f90753c6c69c6db8a84b06c2908cc0aea3c4a4d5e0805"
        }
      }
    ]);
  });

  test("pay with faucet action", async () => {
    const faucetPath = "https://faucet.decred.org/requestfaucet";
    const params = [FAKE_ADDRESS, AMOUNT];

    //test payment succeed
    store.clearActions();
    setPostSuccessResponse(
      faucetPath,
      {},
      { TxId: FAKE_TRANSACTION, Error: "" }
    );
    await store.dispatch(ea.payWithFaucet.apply(null, params));
    expect(store.getActions()).toEqual([
      {
        type: act.REQUEST_PAYWALL_PAYMENT_WITH_FAUCET,
        error: false,
        payload: undefined
      },
      {
        type: act.RECEIVE_PAYWALL_PAYMENT_WITH_FAUCET,
        error: false,
        payload: { TxId: FAKE_TRANSACTION, Error: "" }
      }
    ]);
    //test when payment fails
    store.clearActions();
    setPostErrorResponse(faucetPath, {}, { status: 404 });
    await store.dispatch(ea.payWithFaucet.apply(null, params)).catch(e => {
      expect(store.getActions()).toEqual([
        {
          type: act.REQUEST_PAYWALL_PAYMENT_WITH_FAUCET,
          error: false,
          payload: undefined
        },
        {
          type: act.RECEIVE_PAYWALL_PAYMENT_WITH_FAUCET,
          error: true,
          payload: e
        }
      ]);
    });
  });
});

import * as sel from "../external_api";
import { MOCK_STATE } from "./mock_state";

describe("test external_api selector", () => {
  test("testing higher order selectors", () => {
    // isRequesting
    expect(sel.getIsExtApiRequesting("payWithFaucet")(MOCK_STATE)).toEqual(
      MOCK_STATE.external_api.payWithFaucet.isRequesting
    );

    // response
    expect(sel.getExtApiResponse("payWithFaucet")(MOCK_STATE)).toEqual(
      MOCK_STATE.external_api.payWithFaucet.response
    );

    // error
    expect(sel.getExtApiError("payWithFaucet")(MOCK_STATE)).toEqual(
      MOCK_STATE.external_api.payWithFaucet.error
    );
  });

  test("testing 'or' and composed selectors", () => {
    let state;

    expect(sel.isApiRequestingPayWithFaucet(MOCK_STATE)).toEqual(false);

    state = {
      external_api: {
        ...MOCK_STATE.external_api,
        payWithFaucet: { isRequesting: true }
      }
    };

    expect(sel.isApiRequestingPayWithFaucet(state)).toEqual(true);

    state = {
      external_api: {
        ...MOCK_STATE.external_api,
        payWithFaucet: { isRequesting: false },
        blockHeight: { isRequesting: true }
      }
    };

    expect(sel.isApiRequestingPayWithFaucet(state)).toEqual(true);

    state = {
      external_api: {
        ...MOCK_STATE.external_api,
        payWithFaucet: { isRequesting: false },
        blockHeight: { isRequesting: false }
      }
    };

    expect(sel.isApiRequestingPayWithFaucet(state)).toEqual(false);

    expect(sel.payWithFaucetTxId(MOCK_STATE)).toEqual(
      MOCK_STATE.external_api.payWithFaucet.response.Txid
    );
  });
});

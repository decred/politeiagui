import fetchMock from "fetch-mock";
import * as ea from "../external_api";
import {
  assertGETOnRouteIsCalled,
  assertPOSTOnRouteIsCalled
} from "./support/helpers";
describe("test external api lib (lib/api.js)", () => {
  const FAKE_TESTNET_ADDRESS = "T_fake_address";
  const FAKE_MAINNET_ADDRESS = "M_fake_address";
  const dcrdataTestnetUrl = "https://testnet.decred.org/api";
  const dcrdataExplorerUrl = "https://dcrdata.decred.org/api";
  const faucetUrl = "https://faucet.decred.org/requestfaucet";

  test("get height from dcrd data", async () => {
    await assertGETOnRouteIsCalled(
      `${dcrdataTestnetUrl}/block/best/height`,
      ea.getHeightByDcrdata,
      [true]
    );
    await assertGETOnRouteIsCalled(
      `${dcrdataExplorerUrl}/block/best/height`,
      ea.getHeightByDcrdata,
      [false]
    );
  });

  test("get payment by address from dcr data", async () => {
    fetchMock.restore();
    await assertGETOnRouteIsCalled(
      `${dcrdataTestnetUrl}/address/${FAKE_TESTNET_ADDRESS}/raw`,
      ea.getPaymentsByAddressDcrdata,
      [FAKE_TESTNET_ADDRESS]
    );
    await assertGETOnRouteIsCalled(
      `${dcrdataExplorerUrl}/address/${FAKE_MAINNET_ADDRESS}/raw`,
      ea.getPaymentsByAddressDcrdata,
      [FAKE_MAINNET_ADDRESS]
    );
  });

  test("pay with faucet", async () => {
    await assertPOSTOnRouteIsCalled(faucetUrl, ea.payWithFaucet, [
      FAKE_TESTNET_ADDRESS,
      10
    ]);
  });
});

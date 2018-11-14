import * as sel from "../index";
import { MOCK_STATE } from "./mock_state";

describe("test index selector", () => {
  test("testing selectorMap", () => {
    expect(sel.selectorMap()).toEqual(expect.any(Function));

    expect(
      sel.selectorMap({
        email: sel.email,
        isAdmin: sel.isAdmin
      })(MOCK_STATE)
    ).toEqual({ email: "testme@email.com", isAdmin: true });
  });
});

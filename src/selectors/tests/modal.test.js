import * as sel from "../modal";

describe("test modal selector", () => {
  test("testing getopenedModals selector", () => {
    expect(
      sel.getopenedModals({
        modal: { openedModals: ["confirm, signup, register"] }
      })
    ).toEqual(["confirm, signup, register"]);
  });
});

import * as lib from "../lib";
describe("test action/lib.js", () => {
  test("test basic action", () => {
    const type = "any";
    const payload = "any_payload";
    const error = "its an error";
    expect(lib.basicAction(type)(payload, false)).toEqual({
      type,
      error: false,
      payload
    });
    expect(lib.basicAction(type)(payload, error)).toEqual({
      type,
      error: true,
      payload: error
    });
  });

  test("reduce types", () => {
    const types = {
      TYPE_1: "TYPE_1",
      TYPE_2: "TYPE_2"
    };
    const reducedTypes = lib.reduceTypes(types);
    expect(reducedTypes.TYPE_1(null, "error")).toEqual(
      lib.basicAction(types.TYPE_1)(null, "error")
    );
    expect(reducedTypes.TYPE_2(null, "error")).toEqual(
      lib.basicAction(types.TYPE_2)(null, "error")
    );
  });
});

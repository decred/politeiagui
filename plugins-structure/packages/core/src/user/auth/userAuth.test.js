import reducer, { initialState, userLogin, userSignup } from "./userAuthSlice";
import { configureStore } from "@reduxjs/toolkit";
import { client } from "../../client/client";
import { pki } from "../../pki";

describe("Given the userAuthSlice", () => {
  let store;
  // spy on the method used to fetch
  let userLoginSpy, userSignupSpy;
  const extraArgument = { ...client, pki };
  beforeEach(() => {
    // mock a minimal store with extra argument
    // re-create the store before each test
    store = configureStore({
      reducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          // This will make the client available in the 'extra' argument
          // for all our thunks created with createAsyncThunk
          thunk: {
            extraArgument,
          },
        }),
    });
    userLoginSpy = jest.spyOn(extraArgument, "userLogin");
    userSignupSpy = jest.spyOn(extraArgument, "userSignup");
  });
  afterEach(() => {
    userLoginSpy.mockRestore();
    userSignupSpy.mockRestore();
  });

  describe("when empty params", () => {
    it("should return the initial state", () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });
  });

  describe("userLogin", () => {
    describe("when dispatched with invalid params", () => {
      it("should not fetch nor fire actions", async () => {
        const badArgs = [
          null,
          undefined,
          { email: "email" },
          { password: "pass" },
        ];
        for (const badArg of badArgs) {
          await store.dispatch(userLogin(badArg));
          expect(userLoginSpy).not.toHaveBeenCalled();
          expect(store.getState().status).toEqual("idle");
        }
      });
    });
  });
  // TODO: other user login tests

  describe("userSignup", () => {
    let genPubkeySpy;
    beforeEach(() => {
      genPubkeySpy = jest.spyOn(pki, "generateNewUserPubkeyHex");
      genPubkeySpy.mockResolvedValue("pubkey");
      // Always return a resolved promise for the userSignup call
      userSignupSpy.mockResolvedValue({});
    });
    afterEach(() => {
      genPubkeySpy.mockRestore();
    });

    describe("when dispatched with invalid params", () => {
      it("should not fetch nor fire actions", async () => {
        const badArgs = [
          null,
          undefined,
          { email: "email" },
          { password: "pass" },
          { username: "user" },
          { password: "pass", username: "user" },
          { email: "email", username: "user" },
          { email: "email", password: "pass" },
        ];
        for (const badArg of badArgs) {
          await store.dispatch(userSignup(badArg));
          expect(userSignupSpy).not.toHaveBeenCalled();
          expect(store.getState().status).toEqual("idle");
        }
      });
    });

    describe("when dispatched with valid params", () => {
      const validParms = { email: "email", password: "pass", username: "user" };
      it("should generate a new keypair", async () => {
        await store.dispatch(userSignup(validParms));
        expect(genPubkeySpy).toHaveBeenCalled();
      });
      it("should call userSignup with the correct params", async () => {
        await store.dispatch(userSignup(validParms));
        expect(userSignupSpy).toHaveBeenCalledWith(
          expect.anything(),
          expect.objectContaining({
            email: validParms.email,
            password:
              "73899d2adaad774417b0208da85162b61c8dbdf79bb0f7108c2686b93721d1f4",
            username: validParms.username,
            publickey: "pubkey",
          })
        );
      });
      it("should update status to succeeded", async () => {
        await store.dispatch(userSignup(validParms));
        expect(store.getState().status).toEqual("succeeded");
      });
    });

    describe("when dispatched with valid params and userSignup fails", () => {
      const validParms = { email: "email", password: "pass", username: "user" };
      const err = { message: "error msg" };
      beforeEach(() => {
        // Always return a rejected promise for the userSignup call
        userSignupSpy.mockRejectedValue(err);
      });
      it("should update status to failed", async () => {
        const genPubkeySpy = jest.spyOn(pki, "generateNewUserPubkeyHex");
        genPubkeySpy.mockResolvedValue("pubkey");
        await store.dispatch(userSignup(validParms));
        expect(store.getState().status).toEqual("failed");
      });
      it("should update error to the error message", async () => {
        await store.dispatch(userSignup(validParms));
        expect(store.getState().error).toEqual(err.message);
      });
    });
  });
});

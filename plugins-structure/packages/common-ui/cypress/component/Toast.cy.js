import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import React from "react";
import { Provider } from "react-redux";
import { Toast } from "../../src/components/Toast";

const message = createAction("message");
const reducer = createReducer(
  { globalMessage: { title: null, body: null } },
  (builder) => {
    builder.addCase(message, (state, action) => {
      state.globalMessage = action.payload;
    });
  }
);

const msg = { title: "Title", body: "Body" };

const fakeStore = configureStore({ reducer });

describe("Given <Toast />", () => {
  it("should render message", () => {
    cy.viewport("macbook-16");
    cy.mount(
      <Provider store={fakeStore}>
        <Toast />
        <button
          onClick={() => {
            fakeStore.dispatch(message(msg));
          }}
        >
          Click
        </button>
      </Provider>
    );
    cy.get("[data-testid=common-ui-toast]").should("not.exist");
    cy.get("button").click();
    cy.get("[data-testid=common-ui-toast]").should("exist");
  });
});

import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import React from "react";
import { Provider } from "react-redux";
import { ProgressBar } from "../../src/components/ProgressBar";

const increase = createAction("increase");
const reducer = createReducer(
  { globalProgress: { value: 0, total: 0 } },
  (builder) => {
    builder.addCase(increase, (state, action) => {
      state.globalProgress = action.payload;
    });
  }
);

const fakeStore = configureStore({ reducer });

describe("Given <ProgressBar />", () => {
  it("should display progress", () => {
    const width = 500;
    cy.viewport(width, 1000);
    cy.mount(
      <Provider store={fakeStore}>
        <ProgressBar />
        <button
          onClick={() => {
            fakeStore.dispatch(increase({ total: 100, value: 100 }));
          }}
        >
          click
        </button>
      </Provider>
    );
    cy.get("[data-testid=common-ui-progress-bar]").should("not.exist");
    cy.get("button").click();
    cy.get("[data-testid=common-ui-progress-bar]")
      .should("be.visible")
      .and("have.css", "width")
      .and("eq", `${width}px`);
  });
});

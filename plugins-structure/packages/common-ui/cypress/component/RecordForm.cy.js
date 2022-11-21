import React from "react";
import { RecordForm } from "../../src/components/RecordForm";

describe("Given <RecordForm/>", () => {
  it("should render all form elements", () => {
    cy.mount(
      <RecordForm>
        {({
          CurrencyInput,
          DatePickerInput,
          ErrorMessage,
          MarkdownInput,
          SaveButton,
          SelectInput,
          SubmitButton,
          TextInput,
          Warning,
        }) => (
          <div>
            <CurrencyInput name="currency" className="currency" />
            <DatePickerInput id="datepicker" />
            <ErrorMessage error={Error("My Error")} />
            <MarkdownInput name="markdown" className="markdown" />
            <SubmitButton id="submit-button" />
            <SaveButton id="save-button" />
            <TextInput name="text" className="text" />
            <SelectInput id="select" />
            <Warning>warning</Warning>
          </div>
        )}
      </RecordForm>
    );
    cy.get(".currency > input").should("be.visible").and("be.enabled");
    cy.get(".text > input").should("be.visible").and("be.enabled");
    cy.get(".markdown").should("be.visible").and("be.enabled");
    cy.get("#datepicker input").should("be.visible").and("be.enabled");
    cy.get("#submit-button").should("be.visible").and("be.enabled");
    cy.get("#save-button").should("be.visible").and("be.enabled");
    cy.get("[data-testid=record-form-error-message]").should("be.visible");
    cy.get("[data-testid=record-form-warning-message]").should("be.visible");
    cy.get("#select input").should("be.enabled");
  });
});

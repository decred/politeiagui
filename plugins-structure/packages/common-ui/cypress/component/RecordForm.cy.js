import React from "react";
import { RecordForm } from "../../src";

describe("Given <RecordForm/>", () => {
  it("should render all form elements", () => {
    cy.mount(
      <RecordForm>
        {({
          Checkbox,
          CurrencyInput,
          DatePickerInput,
          DigitsInput,
          ErrorMessage,
          MarkdownInput,
          NumberInput,
          SaveButton,
          SelectInput,
          SubmitButton,
          TextInput,
          FileInput,
          Input,
          Warning,
          InfoMessage,
        }) => (
          <div>
            {/* Messages */}
            <ErrorMessage error={Error("My Error")} />
            <Warning>warning</Warning>
            <InfoMessage>Info</InfoMessage>
            {/* Buttons */}
            <SubmitButton id="submit-button" />
            <SaveButton id="save-button" />
            {/* Inputs */}
            <Checkbox name="checkbox" className="checkbox" />
            <CurrencyInput name="currency" className="currency" />
            <DatePickerInput className="datepicker" />
            <DigitsInput name="digits" className="digits" />
            <FileInput name="file" className="file" />
            <Input name="input" className="input" />
            <MarkdownInput name="markdown" className="markdown" />
            <NumberInput name="number" className="number" />
            <SelectInput id="select" />
            <TextInput name="text" className="text" id="txt" />
          </div>
        )}
      </RecordForm>
    );
    // Inputs
    cy.get(".checkbox").should("be.visible");
    cy.get(".currency > input").should("be.visible").and("be.enabled");
    cy.get(".datepicker").should("be.visible");
    cy.get(".digits").should("be.visible");
    cy.get(".file").should("be.visible");
    cy.get(".input").should("be.visible");
    cy.get(".markdown").should("be.visible").and("be.enabled");
    cy.get(".number").should("be.visible");
    cy.get("#select input").should("be.enabled");
    cy.get(".text > input").should("be.visible").and("be.enabled");
    // Buttons
    cy.get("#submit-button").should("be.visible").and("be.enabled");
    cy.get("#save-button").should("be.visible").and("be.enabled");
    // Messages
    cy.get("[data-testid=record-form-error-message]").should("be.visible");
    cy.get("[data-testid=record-form-warning-message]").should("be.visible");
    cy.get("[data-testid=record-form-info-message]").should("be.visible");
  });
});

import React from "react";
import { faker } from "@faker-js/faker";
import {
  AccountClearDataModal,
  AccountPasswordChangeModal,
  AccountUsernameChangeModal,
  IdentityCreateModal,
  IdentityImportModal,
  IdentityInactivePubkeysModal,
  ModalProvider,
  UserRegistrationFeeModal,
} from "../../src";

const modalProps = {
  show: true,
  onClose: () => {},
};

describe("Given <AccountClearDataModal />", () => {
  it("should render confirm modal", () => {
    const onSubmit = cy.stub();
    cy.mount(
      <ModalProvider>
        <AccountClearDataModal {...modalProps} onSubmit={onSubmit} />
      </ModalProvider>
    );
    cy.get("[data-testid=modal-confirm-submit-button]")
      .click()
      .then(() => {
        expect(onSubmit).to.be.calledWith();
      });
  });
});

describe("Given <AccountPasswordChangeModal />", () => {
  it("should render password change form and submit", () => {
    const onSubmit = cy.stub();
    const values = { current: "pass", newpassword: "pwd", verify: "pwd" };
    cy.mount(
      <ModalProvider>
        <AccountPasswordChangeModal {...modalProps} onSubmit={onSubmit} />
      </ModalProvider>
    );
    cy.get("#current").type(values.current);
    cy.get("#newpassword").type(values.newpassword);
    cy.get("#verify").type(values.verify);
    cy.get("#account-change-password-button")
      .click()
      .then(() => {
        expect(onSubmit).to.be.calledWith(values);
      });
  });
});

describe("Given <AccountUsernameChangeModal />", () => {
  it("should render username change form and submit", () => {
    const onSubmit = cy.stub();
    const values = { username: "newusername", password: "newpass" };
    cy.mount(
      <ModalProvider>
        <AccountUsernameChangeModal {...modalProps} onSubmit={onSubmit} />
      </ModalProvider>
    );
    cy.get("#username").type(values.username);
    cy.get("#password").type(values.password);
    cy.get("#account-change-username-button")
      .click()
      .then(() => {
        expect(onSubmit).to.be.calledWith(values);
      });
  });
});

describe("Given <IdentityCreateModal />", () => {
  it("should display message and submit", () => {
    const onSubmit = cy.stub();
    cy.mount(
      <ModalProvider>
        <IdentityCreateModal {...modalProps} onSubmit={onSubmit} />
      </ModalProvider>
    );
    cy.get("[data-testid=modal-confirm-message]").should(
      "include.text",
      "Creating a new identity"
    );
    cy.get("[data-testid=modal-confirm-submit-button]")
      .click()
      .then(() => {
        expect(onSubmit).to.be.calledWith();
      });
    cy.get("[data-testid=modal-confirm-success-message]").should(
      "include.text",
      "Your new identity has been requested, please check your email"
    );
  });
});

describe("given <IdentityImportModal />", () => {
  it("should display identity import form", () => {
    const onSubmit = cy.stub();
    const values = { publicKey: "publickey", secretKey: "privateKey" };
    cy.mount(
      <ModalProvider>
        <IdentityImportModal {...modalProps} onSubmit={onSubmit} />
      </ModalProvider>
    );
    cy.get("#pubkey-input").type(values.publicKey);
    cy.get("#privkey-input").type(values.secretKey);
    cy.get("[data-testid=identity-import-modal-update-button]")
      .click()
      .then(() => {
        expect(onSubmit).to.be.calledWith(values);
      });
  });
  it("should allow identity imports from json files", () => {
    const onSubmit = cy.stub();
    cy.fixture("identity.json").as("identity");

    cy.mount(
      <ModalProvider>
        <IdentityImportModal {...modalProps} onSubmit={onSubmit} />
      </ModalProvider>
    );

    cy.get("label[for=file]").selectFile("@identity");
    cy.get("[data-testid=identity-import-modal-update-button]").click();
    cy.get("@identity").then(({ publicKey, secretKey }) => {
      expect(onSubmit).to.be.calledWith({ publicKey, secretKey });
    });
  });
  it("should display error when file is invalid", () => {
    const onSubmit = cy.stub();
    cy.fixture("invalid").as("invalid");
    cy.mount(
      <ModalProvider>
        <IdentityImportModal {...modalProps} onSubmit={onSubmit} />
      </ModalProvider>
    );
    cy.get("label[for=file]").selectFile("@invalid");
    cy.get("[data-testid=record-form-error-message]")
      .should("be.visible")
      .and("have.text", "Invalid identity file.");
  });
});

describe("Given <IdentityInactivePubkeysModal />", () => {
  const listSize = 20;
  const keys = Array(listSize)
    .fill("")
    .map(() => ({ pubkey: faker.datatype.hexadecimal(64) }));
  it("should render all keys", () => {
    cy.mount(
      <ModalProvider>
        <IdentityInactivePubkeysModal {...modalProps} keys={keys} />
      </ModalProvider>
    );
    cy.get("li")
      .should("have.length", listSize)
      .each((item, i) => {
        cy.wrap(item).should("have.text", keys[i].pubkey);
      });
  });
});

describe("Given <UserRegistrationFeeModal />", () => {
  it("should render address and qrcode", () => {
    cy.mount(
      <ModalProvider>
        <UserRegistrationFeeModal {...modalProps} address="abcdef" />
      </ModalProvider>
    );
    cy.get("[data-testid=payment-code]").should("be.visible");
    cy.get("[data-testid=payment-value]").should("be.visible");
    cy.get("[data-testid=payment-address]").should("be.visible");
  });
});

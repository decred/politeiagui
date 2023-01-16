import React from "react";
import {
  ModalConfirm,
  ModalConfirmWithReason,
  ModalExternalLink,
  ModalForm,
  ModalImages,
  ModalProvider,
} from "../../src";
import { faker } from "@faker-js/faker";

const defaultModalProps = {
  show: true,
  title: "Modal",
  message: "Are you ok?",
  successMessage: "Success",
  successTitle: "Title Success",
};

describe("Given <ModalConfirm />", () => {
  let onClose, onSubmit, onCloseSuccess;
  describe("when submit succeeds", () => {
    beforeEach(() => {
      onClose = cy.stub();
      onSubmit = cy.stub();
      onCloseSuccess = cy.stub();
      cy.mount(
        <ModalProvider>
          <ModalConfirm
            {...defaultModalProps}
            onClose={onClose}
            onCloseSuccess={onCloseSuccess}
            onSubmit={onSubmit}
          />
        </ModalProvider>
      );
    });
    it("should render confirm button", () => {
      cy.contains(defaultModalProps.title);
      cy.contains(defaultModalProps.message);
    });
    it("should confirm and close modal", () => {
      cy.get("[data-testid=modal-confirm-submit-button]")
        .click()
        .then(() => {
          expect(onSubmit).to.be.callCount(1);
        });
      cy.get("[data-testid=modal-confirm-message]").should("not.exist");
      cy.get("[data-testid=modal-confirm-success-message]").should(
        "be.visible"
      );
      cy.get("[data-testid=modal-confirm-ok-button]")
        .should("be.visible")
        .click()
        .then(() => {
          expect(onCloseSuccess).to.be.callCount(1);
        });
    });
  });
  describe("when submit fails", () => {
    it("should render error message", () => {
      onClose = cy.stub();
      onSubmit = cy.stub().throws("My Error");
      onCloseSuccess = cy.stub();
      cy.mount(
        <ModalProvider>
          <ModalConfirm
            {...defaultModalProps}
            onClose={onClose}
            onCloseSuccess={onCloseSuccess}
            onSubmit={onSubmit}
          />
        </ModalProvider>
      );
      cy.get("[data-testid=modal-confirm-submit-button]")
        .click()
        .then(() => {
          expect(onSubmit).to.be.callCount(1);
        });
      cy.contains("My Error");
    });
  });
});

describe("Given <ModalConfirmWithReason />", () => {
  it("should confirm with reason", () => {
    const reason = "My Reason";
    const onSubmit = cy.stub();
    cy.mount(
      <ModalProvider>
        <ModalConfirmWithReason {...defaultModalProps} onSubmit={onSubmit} />
      </ModalProvider>
    );
    cy.get("#reason").type(reason);
    cy.get("[data-testid=modal-confirm-submit-button]")
      .click()
      .then(() => {
        expect(onSubmit).to.be.calledWith(reason);
      });
  });
});

describe("Given <ModalExternalLink />", () => {
  it("should display link and warning", () => {
    const link = "https://my-link.com";
    cy.mount(
      <ModalProvider>
        <ModalExternalLink {...defaultModalProps} link={link} />
      </ModalProvider>
    );
    cy.contains(link);
    cy.contains("You are about to be sent to an external website.");
    cy.contains("Are you sure you want to open this link?");
  });
});

describe("Given <ModalForm />", () => {
  it("should display form and submit values", () => {
    const onSubmit = cy.stub();
    const text = "My Text";
    cy.mount(
      <ModalProvider>
        <ModalForm {...defaultModalProps} onSubmit={onSubmit}>
          {({ Input, SubmitButton }) => (
            <div>
              <Input name="input" id="myinput" />
              <Input name="input2" id="myinput2" />
              <SubmitButton id="button" />
            </div>
          )}
        </ModalForm>
      </ModalProvider>
    );
    cy.get("#myinput").type(text);
    cy.get("#myinput2").type(text);
    cy.get("#button")
      .click()
      .then(() => {
        expect(onSubmit).to.be.calledWith({ input: text, input2: text });
      });
  });
});

describe("Given <ModalImages />", () => {
  it("should render images carousel", () => {
    const images = Array(5)
      .fill({})
      .map(() => ({
        alt: faker.word.noun(),
        src: faker.image.abstract(100, 100, true),
      }));
    cy.mount(
      <ModalProvider>
        <ModalImages {...defaultModalProps} images={images} />
      </ModalProvider>
    );
    for (const image of images) {
      cy.get("img")
        .then(([img]) => {
          expect(img.alt).to.equal(image.alt);
          expect(img.src).to.equal(image.src);
        })
        .click();
    }
  });
});

import React from "react";
import {
  ModalConfirm,
  ModalExternalLink,
  ModalImages,
  ModalProvider,
} from "../../src/components/Modal";
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

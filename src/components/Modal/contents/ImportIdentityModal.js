import React from "react";
import ModalContentWrapper from "../ModalContentWrapper";
import modalConnector from "../../../connectors/modal";
import PrivateKeyImportManager from "../../PrivateKeyImportManager";
import PrivateKeyFormManager from "../../PrivateKeyFormManager";
import userConnector from "../../../connectors/user";

const ImportIdentityModal = ({ closeAllModals }) => (
  <ModalContentWrapper title={"Import Identity"} onClose={closeAllModals}>
    <div
      style={{
        width: "100%",
        padding: "1em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column"
      }}
    >
      <PrivateKeyImportManager />
      <h2
        style={{
          fontSize: "1.25em",
          width: "100%",
          textAlign: "center",
          padding: "1em"
        }}
      >
        Or Paste in Your Own
      </h2>
      <PrivateKeyFormManager />
    </div>
  </ModalContentWrapper>
);

export default modalConnector(userConnector(ImportIdentityModal));

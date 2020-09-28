import { useState, useCallback } from "react";
// XXX we CAN'T use the api requests directly here as we need to call proposals
// batch now and it's a POST, for that we need to pass the csrf which isn't
// avaliable here!
import {
  proposalsBatch as onFetchProposalsBatch,
  invoice as onFetchInvoice
} from "src/lib/api.js";
import { getTextFromIndexMd } from "src/helpers";
import { ModalDiffProposal, ModalDiffInvoice } from "src/components/ModalDiff";
import useModalContext from "src/hooks/utils/useModalContext";
import { useConfig } from "src/containers/Config";

const getProposalText = (proposal) => {
  const getMarkdowFile = (prop) =>
    prop.files.filter((file) => file.name === "index.md")[0];
  return proposal ? getTextFromIndexMd(getMarkdowFile(proposal)) : "";
};

const getProposalFilesWithoutIndexMd = (proposal) =>
  proposal ? proposal.files.filter((file) => file.name !== "index.md") : [];

export function useVersionPicker(version, token) {
  const [selectedVersion, setSelectedVersion] = useState(version);
  const [handleOpenModal, handleCloseModal] = useModalContext();
  const { recordType, constants } = useConfig();
  const [error, setError] = useState();

  const onChangeVersion = useCallback(
    async (v) => {
      setSelectedVersion(v);
      try {
        if (recordType === constants.RECORD_TYPE_PROPOSAL) {
          const proposalDiff = await fetchProposalsVersions(token, v);
          handleOpenModal(ModalDiffProposal, {
            proposalDetails: proposalDiff.details,
            onClose: handleCloseModal,
            oldText: proposalDiff.oldText,
            oldFiles: proposalDiff.oldFiles,
            newText: proposalDiff.newText,
            newFiles: proposalDiff.newFiles,
            oldTitle: proposalDiff.oldTitle,
            newTitle: proposalDiff.newTitle
          });
        }
        if (recordType === constants.RECORD_TYPE_INVOICE) {
          const { invoice, prevInvoice } = await fetchInvoiceVersions(token, v);
          handleOpenModal(ModalDiffInvoice, {
            onClose: handleCloseModal,
            invoice,
            prevInvoice
          });
        }
      } catch (err) {
        setError(err);
      }
    },
    [
      setSelectedVersion,
      handleCloseModal,
      handleOpenModal,
      constants,
      recordType,
      token
    ]
  );

  // XXX update the all refs - provide added _state_ param
  async function fetchProposalsVersions(token, version, state) {
    let prevProposal = null;
    // Reponse of batch request is a map
    const { proposals } = await onFetchProposalsBatch(
      [{ token, version }],
      state,
      false,
      false
    );
    const proposal = proposals && proposals[token];
    if (proposal && proposal.version > 1) {
      const { prevProposals } = await onFetchProposalsBatch(
        [{ token, version: version - 1 }],
        state,
        false,
        false
      );
      prevProposal = prevProposals && prevProposals[token];
    }
    return {
      details: proposals[token],
      oldFiles: getProposalFilesWithoutIndexMd(prevProposal),
      newFiles: getProposalFilesWithoutIndexMd(proposal),
      newText: getProposalText(proposal),
      oldText: getProposalText(prevProposal),
      newTitle: proposal.name,
      oldTitle: prevProposal.name
    };
  }

  async function fetchInvoiceVersions(token, version) {
    let prevInvoice = null;
    const { invoice } = await onFetchInvoice(token, version);
    if (invoice.version > 1) {
      const { invoice: prevInvoiceResponse } = await onFetchInvoice(
        token,
        version - 1
      );
      prevInvoice = prevInvoiceResponse;
    }
    return {
      invoice,
      prevInvoice
    };
  }

  const disablePicker = version === "1";

  return {
    disablePicker,
    selectedVersion,
    onChangeVersion,
    error
  };
}

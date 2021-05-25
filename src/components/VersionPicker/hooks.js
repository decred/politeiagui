import { useState, useCallback } from "react";
import { invoice as onFetchInvoice } from "src/lib/api.js";
import { getAttachmentsFiles, parseRawProposal } from "src/helpers";
import { ModalDiffProposal, ModalDiffInvoice } from "src/components/ModalDiff";
import useModalContext from "src/hooks/utils/useModalContext";
import { useConfig } from "src/containers/Config";
import { useAction } from "src/redux";
import * as act from "src/actions";

export function useVersionPicker(version, token) {
  const [selectedVersion, setSelectedVersion] = useState(version);
  const [handleOpenModal, handleCloseModal] = useModalContext();
  const { recordType, constants } = useConfig();
  const [error, setError] = useState();
  const onFetchProposalDetailsWithoutState = useAction(
    act.onFetchProposalDetailsWithoutState
  );

  const fetchProposalVersions = useCallback(
    async (onFetchProposalDetailsWithoutState, token, version) => {
      if (!version) {
        return;
      }

      // Fetch provided version
      const proposal = await onFetchProposalDetailsWithoutState(token, version);
      // Parse current version
      const { description, name } = parseRawProposal(proposal);

      if (version <= 1) {
        return {
          details: proposal,
          oldFiles: getAttachmentsFiles([]),
          newFiles: getAttachmentsFiles(proposal.files),
          newText: description,
          oldText: "",
          newTitle: name,
          oldTitle: ""
        };
      } else {
        // Fetch prev version if version > 1
        const prevProposal = await onFetchProposalDetailsWithoutState(
          token,
          version - 1
        );
        // Parse prev version proposal
        const { description: oldDescription, name: oldName } =
          parseRawProposal(prevProposal);
        return {
          details: proposal,
          oldFiles: getAttachmentsFiles(prevProposal.files),
          newFiles: getAttachmentsFiles(proposal.files),
          newText: description,
          oldText: oldDescription,
          newTitle: name,
          oldTitle: oldName
        };
      }
    },
    []
  );

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

  const onChangeVersion = useCallback(
    async (v) => {
      setSelectedVersion(v);
      try {
        if (recordType === constants.RECORD_TYPE_PROPOSAL) {
          const proposalDiff = await fetchProposalVersions(
            onFetchProposalDetailsWithoutState,
            token,
            v
          );
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
      recordType,
      constants.RECORD_TYPE_PROPOSAL,
      constants.RECORD_TYPE_INVOICE,
      fetchProposalVersions,
      onFetchProposalDetailsWithoutState,
      token,
      handleOpenModal,
      handleCloseModal
    ]
  );

  const disablePicker = version === "1";

  return {
    disablePicker,
    selectedVersion,
    onChangeVersion,
    error
  };
}

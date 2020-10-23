import { useState, useCallback } from "react";
import { invoice as onFetchInvoice } from "src/lib/api.js";
import { getTextFromIndexMd, parseProposalMetadata } from "src/helpers";
import { ModalDiffProposal, ModalDiffInvoice } from "src/components/ModalDiff";
import useModalContext from "src/hooks/utils/useModalContext";
import { useConfig } from "src/containers/Config";
import { useAction } from "src/redux";
import * as act from "src/actions";

const getProposalTitle = (proposal) => {
  const { name } = parseProposalMetadata(proposal);
  return name;
};

const getProposalText = (proposal) => {
  const getMarkdowFile = (prop) =>
    prop.files.filter((file) => file.name === "index.md")[0];
  return proposal ? getTextFromIndexMd(getMarkdowFile(proposal)) : "";
};

const getProposalFilesWithoutIndexMd = (proposal) =>
  proposal ? proposal.files.filter((file) => file.name !== "index.md") : [];

export function useVersionPicker(version, token, state) {
  const [selectedVersion, setSelectedVersion] = useState(version);
  const [handleOpenModal, handleCloseModal] = useModalContext();
  const { recordType, constants } = useConfig();
  const [error, setError] = useState();
  const onFetchProposalsBatchWithoutState = useAction(
    act.onFetchProposalsBatchWithoutState
  );

  const fetchProposalVersions = useCallback(
    async (onFetchProposalsBatchWithoutState, token, version, state) => {
      if (!version || version < 2) {
        return;
      }
      // Fetch provided version
      const [proposals] = await onFetchProposalsBatchWithoutState(
        [{ token, version: version.toString() }],
        state,
        true,
        false
      );
      const proposal = proposals && proposals[token];

      // Fetch prev version
      const [prevProposals] = await onFetchProposalsBatchWithoutState(
        [{ token, version: (version - 1).toString() }],
        state,
        true,
        false
      );
      const prevProposal = prevProposals && prevProposals[token];

      return {
        details: proposals[token],
        oldFiles: getProposalFilesWithoutIndexMd(prevProposal),
        newFiles: getProposalFilesWithoutIndexMd(proposal),
        newText: getProposalText(proposal),
        oldText: getProposalText(prevProposal),
        newTitle: getProposalTitle(proposal),
        oldTitle: getProposalTitle(prevProposal)
      };
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
            onFetchProposalsBatchWithoutState,
            token,
            v,
            state
          );
          console.log(proposalDiff);
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
      onFetchProposalsBatchWithoutState,
      token,
      state,
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

import { useState } from "react";
import {
  proposal as onFetchProposal,
  invoice as onFetchInvoice
} from "src/lib/api.js";
import { getTextFromIndexMd } from "src/helpers";
import {
  ModalDiffProposal,
  ModalDiffInvoice,
  ModalDiffLoader
} from "src/components/ModalDiff";
import useModalContext from "src/hooks/utils/useModalContext";
import { useConfig } from "src/containers/Config";
import { useSelector } from "src/redux";
import { proposalIsRequesting } from "src/selectors";

const getProposalText = (proposal) => {
  const getMarkdowFile = (prop) =>
    prop.files.filter((file) => file.name === "index.md")[0];
  return proposal ? getTextFromIndexMd(getMarkdowFile(proposal)) : "";
};

const getProposalFilesWithoutIndexMd = (proposal) =>
  proposal ? proposal.files.filter((file) => file.name !== "index.md") : [];

export function useVersionPicker(version, token) {
  const isLoadingProposal = useSelector(proposalIsRequesting);
  const [selectedVersion, setSelectedVersion] = useState(version);
  const [handleOpenModal, handleCloseModal] = useModalContext();
  const { recordType, constants } = useConfig();
  const [error, setError] = useState();

  const openModalLoader = (isInvoice) =>
    handleOpenModal(ModalDiffLoader, {
      onClose: handleCloseModal,
      isInvoice
    });

  const onChangeVersion = async (v) => {
    setSelectedVersion(v);
    try {
      if (recordType === constants.RECORD_TYPE_PROPOSAL) {
        openModalLoader();
        const proposalDiff = await fetchProposalsVersions(token, v);
        setTimeout(() => {
          handleCloseModal();
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
        }, 500);
      }
      if (recordType === constants.RECORD_TYPE_INVOICE) {
        openModalLoader();
        const { invoice, prevInvoice } = await fetchInvoiceVersions(token, v);
        setTimeout(() => {
          handleCloseModal();
          handleOpenModal(ModalDiffInvoice, {
            onClose: handleCloseModal,
            invoice,
            prevInvoice
          });
        }, 500);
      }
    } catch (err) {
      setError(err);
    }
  };

  async function fetchProposalsVersions(token, version) {
    let prevProposal = null;
    const { proposal } = await onFetchProposal(token, version);
    if (proposal.version > 1) {
      const prevProposalResponse = await onFetchProposal(token, version - 1);
      prevProposal = prevProposalResponse.proposal;
    }
    return {
      details: proposal,
      oldFiles: getProposalFilesWithoutIndexMd(prevProposal),
      newFiles: getProposalFilesWithoutIndexMd(proposal),
      newText: getProposalText(proposal),
      oldText: getProposalText(prevProposal),
      newTitle: proposal.name,
      oldTitle: prevProposal ? prevProposal.name : ""
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
    error,
    loading: isLoadingProposal
  };
}

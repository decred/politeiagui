import { useState } from "react";
import { proposal as onFetchProposal } from "src/lib/api.js";
import { getTextFromIndexMd } from "src/helpers";
import ModalDiff from "src/components/ModalDiff";
import useModalContext from "src/hooks/utils/useModalContext";

const getProposalText = (proposal) => {
  const getMarkdowFile = (prop) =>
    prop.files.filter((file) => file.name === "index.md")[0];
  return proposal ? getTextFromIndexMd(getMarkdowFile(proposal)) : "";
};

const getProposalFilesWithoutIndexMd = (proposal) =>
  proposal ? proposal.files.filter((file) => file.name !== "index.md") : [];

export function useVersionPicker(ownProps) {
  const [selectedVersion, setSelectedVersion] = useState(ownProps.version);
  const [handleOpenModal, handleCloseModal] = useModalContext();

  const onChangeVersion = async (v) => {
    setSelectedVersion(v);
    const proposalDiff = await fetchProposalsVersions(
      ownProps.token,
      selectedVersion
    );
    handleOpenModal(ModalDiff, {
      proposalDetails: proposalDiff.details,
      onClose: handleCloseModal,
      oldText: proposalDiff.oldText,
      oldFiles: proposalDiff.oldFiles,
      newText: proposalDiff.newText,
      newFiles: proposalDiff.newFiles
    });
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
      oldText: getProposalText(prevProposal)
    };
  }

  const disablePicker = ownProps.version === "1";

  return {
    disablePicker,
    selectedVersion,
    onChangeVersion
  };
}

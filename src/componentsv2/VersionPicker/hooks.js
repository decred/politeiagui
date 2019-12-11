import { useState, useEffect } from "react";
import { proposal as onFetchProposal } from "src/lib/api.js";
import { getTextFromIndexMd } from "src/helpers";

const getProposalText = (proposal) => {
  const getMarkdowFile = (prop) =>
    prop.files.filter((file) => file.name === "index.md")[0];
  return proposal ? getTextFromIndexMd(getMarkdowFile(proposal)) : "";
};

const getProposalFilesWithoutIndexMd = (proposal) =>
  proposal ? proposal.files.filter((file) => file.name !== "index.md") : [];

export function useVersionPicker(ownProps) {
  const [selectedVersion, setSelectedVersion] = useState(ownProps.version);
  const [proposalDiff, setProposalDiff] = useState();
  const [showModal, setShowModal] = useState(false);

  const onChangeVersion = (v) => {
    setSelectedVersion(v);
    setShowModal(true);
  };
  const onToggleModal = () => {
    setShowModal(!showModal);
  };

  async function fetchProposalsVersions(token, version) {
    let prevProposal = null;
    const { proposal } = await onFetchProposal(token, version);
    if (proposal.version > 1) {
      const prevProposalResponse = await onFetchProposal(token, version - 1);
      prevProposal = prevProposalResponse.proposal;
    }
    setProposalDiff({
      details: proposal,
      oldFiles: getProposalFilesWithoutIndexMd(prevProposal),
      newFiles: getProposalFilesWithoutIndexMd(proposal),
      newText: getProposalText(proposal),
      oldText: getProposalText(prevProposal)
    });
  }

  const disablePicker = ownProps.version === "1";

  useEffect(() => {
    if (showModal) {
      fetchProposalsVersions(ownProps.token, selectedVersion);
    }
  }, [selectedVersion, showModal, ownProps.token]);

  return {
    disablePicker,
    selectedVersion,
    onChangeVersion,
    showModal,
    onToggleModal,
    proposalDiff
  };
}

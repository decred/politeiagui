import React from "react";
import Diff from "../../snew/Markdown/Diff";
import { proposal as fetchProposal } from "../../../lib/api";
import proposalConnector from "../../../connectors/proposal";
import modalConnector from "../../../connectors/modal";
import { getTextFromIndexMd, formatDate } from "../../../helpers";

class ProposalVersionDiff extends React.Component {
  state = {
    proposal: null,
    prevProposal: null,
    error: null,
    loading: true
  };
  componentDidMount() {
    const {
      me: {
        payload: { token, version }
      }
    } = this.props;
    this.fetchProposalsVersions(token, version);
  }
  fetchProposalsVersions = async (token, version) => {
    // fetch proposals versions needs to fetch the requested version
    // and the version before that so it's possible to construct the
    // revision diff.
    try {
      let prevProposal = null;
      const { proposal } = await fetchProposal(token, version);
      // if version is bigger than 1, also fetch the previous one
      if (version > 1) {
        const prevProposalRes = await fetchProposal(
          token,
          parseInt(version, 10) - 1
        );
        prevProposal = prevProposalRes.proposal;
      }
      this.setState({ proposal, prevProposal, loading: false });
    } catch (e) {
      this.setState({ error: e, loading: false });
    }
  };

  getProposalText = proposal => {
    const getMarkdowFile = prop =>
      prop.files.filter(file => file.name === "index.md")[0];
    return proposal ? getTextFromIndexMd(getMarkdowFile(proposal)) : "";
  };

  getProposalFilesWithourIndexMd = proposal =>
    proposal ? proposal.files.filter(file => file.name !== "index.md") : [];

  render() {
    const { proposal, prevProposal, loading, error } = this.state;
    const { closeModal } = this.props;
    const oldText = this.getProposalText(prevProposal);
    const currentText = this.getProposalText(proposal);

    // remove first file (index.md) from the diff files
    const oldFiles = this.getProposalFilesWithourIndexMd(prevProposal);
    const newFiles = this.getProposalFilesWithourIndexMd(proposal);
    return (
      <Diff
        userName={proposal ? proposal.username : ""}
        lastEdition={proposal ? formatDate(proposal.timestamp) : ""}
        onClose={closeModal}
        oldProposal={oldText}
        newProposal={currentText}
        oldFiles={oldFiles}
        newFiles={newFiles}
        title={proposal ? proposal.name : ""}
        version={proposal ? proposal.version : ""}
        loading={loading}
        error={error}
      />
    );
  }
}

export default modalConnector(proposalConnector(ProposalVersionDiff));

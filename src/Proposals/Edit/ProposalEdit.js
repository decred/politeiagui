import { ProposalSubmitPage } from "src/Proposals/SubmitPage";
import { editProposalConnector } from "./hooks";

// TODO: Proposal Edit specific UI goes here
export const ProposalEdit = editProposalConnector(ProposalSubmitPage);

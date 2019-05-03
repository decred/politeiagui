import { ProposalSubmitPage } from "src/Proposals/SubmitPage";
import { newProposalConnector } from "./hooks";

// TODO: Proposal create specific UI goes here
export const ProposalNew = newProposalConnector(ProposalSubmitPage);

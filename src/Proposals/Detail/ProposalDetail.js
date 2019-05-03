import RecordDetail from "src/components/RecordDetail";
import { proposalConnector } from "./hooks";

// TODO: Proposal specific UI goes here
export const ProposalDetail = proposalConnector(RecordDetail);

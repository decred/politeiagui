import { DownloadBundle } from "src/components/DownloadBundle";
import { proposalDownloadConnector } from "./hooks";

export const ProposalDownload = proposalDownloadConnector(DownloadBundle);

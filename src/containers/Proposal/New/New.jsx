import { Message } from "pi-ui";
import React from "react";
import ProposalForm from "src/componentsv2/ProposalForm";
import { PAYWALL_STATUS_PAID } from "src/constants";
import usePaywall from "src/hooks/usePaywall";
import { useNewProposal } from "./hooks";

const NewProposal = () => {
  const { onSubmitProposal } = useNewProposal();
  const { userPaywallStatus } = usePaywall();
  const isPaid = userPaywallStatus === PAYWALL_STATUS_PAID;
  return isPaid ? <ProposalForm onSubmit={onSubmitProposal} /> : <Message kind="warning">You must pay the paywall to create a proposal</Message>;
};

export default NewProposal;

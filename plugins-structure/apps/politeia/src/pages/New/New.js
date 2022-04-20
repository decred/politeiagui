import React from "react";
import { ProposalForm } from "../../components/Proposal/ProposalForm";

function New() {
  function handleSubmit(data) {
    console.log(data);
  }
  function handleSave(data) {
    console.log("saving...", data);
  }
  return <ProposalForm onSave={handleSave} onSubmit={handleSubmit} />;
}

export default New;

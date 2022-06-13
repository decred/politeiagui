import React from "react";
import { useSelector } from "react-redux";
import { SingleContentPage } from "@politeiagui/common-ui/layout";
import { ProposalForm } from "../../components/Proposal/ProposalForm";
import { piPolicy } from "../../pi/policy";
import { H1 } from "pi-ui";

function New() {
  function handleSubmit(data) {
    console.log(data);
  }
  function handleSave(data) {
    console.log("saving...", data);
  }
  const { domains, startdatemin, enddatemax } = useSelector(piPolicy.selectAll);

  return (
    <SingleContentPage banner={<H1>Create Proposal</H1>}>
      <ProposalForm
        onSave={handleSave}
        onSubmit={handleSubmit}
        domains={domains}
        maxEndDate={enddatemax}
        minStartDate={startdatemin}
      />
    </SingleContentPage>
  );
}

export default New;

import React from "react";
import { H1 } from "pi-ui";
import { useSelector } from "react-redux";
import { SingleContentPage } from "@politeiagui/common-ui/layout";
import { ProposalForm } from "../../components/Proposal/ProposalForm";
import { piPolicy } from "../../pi/policy";
import { decodeProposalRecordForm } from "../../pi/proposals/utils";
import { records } from "@politeiagui/core/records";

function Edit({ token }) {
  const { domains, startdatemin, enddatemax } = useSelector(piPolicy.selectAll);
  const fullToken = useSelector((state) =>
    records.selectFullToken(state, token)
  );
  const record = useSelector((state) =>
    records.selectByToken(state, fullToken)
  );
  const proposalFormValues = decodeProposalRecordForm(record);

  function handleSubmit(data) {
    console.log(data);
  }

  return (
    <SingleContentPage banner={<H1>Edit Proposal</H1>}>
      {record && proposalFormValues ? (
        <ProposalForm
          initialValues={proposalFormValues}
          // onSave={handleSave}
          onSubmit={handleSubmit}
          domains={domains}
          maxEndDate={enddatemax}
          minStartDate={startdatemin}
        />
      ) : null}
    </SingleContentPage>
  );
}

export default Edit;

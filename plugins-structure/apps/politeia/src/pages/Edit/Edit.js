import React from "react";
import { H1 } from "pi-ui";
import { useSelector } from "react-redux";
import { SingleContentPage } from "@politeiagui/common-ui/layout";
import { ProposalForm } from "../../components/Proposal/ProposalForm";
import { piPolicy } from "../../pi/policy";
import { decodeProposalRecordForm } from "../../pi/proposals/utils";
import { records } from "@politeiagui/core/records";
import { GoBackLink } from "@politeiagui/common-ui";

function ProposalEditPage({ token }) {
  const policy = useSelector(piPolicy.selectAll);
  const record = useSelector((state) =>
    records.selectByShortToken(state, token)
  );
  const proposalFormValues = decodeProposalRecordForm(record);

  function handleSubmit(data) {
    console.log(data);
  }

  return (
    <SingleContentPage banner={<H1>Edit Proposal</H1>}>
      <GoBackLink
        style={{ marginBottom: "2rem" }}
        data-testid="proposal-go-back"
        backFromPathname={`/record/${token}`}
      />
      {record && proposalFormValues ? (
        <ProposalForm
          initialValues={proposalFormValues}
          // onSave={handleSave}
          onSubmit={handleSubmit}
          policy={policy}
        />
      ) : null}
    </SingleContentPage>
  );
}

export default ProposalEditPage;

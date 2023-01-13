import React from "react";
import { recordsDrafts } from "@politeiagui/core/records/drafts";
import { useDispatch, useSelector } from "react-redux";
import { SingleContentPage } from "@politeiagui/common-ui/layout";
import { ProposalForm } from "../../components/Proposal/ProposalForm";
import { piPolicy } from "../../pi/policy";
import { H1 } from "pi-ui";
import { decodeProposalDraftForm } from "../../pi/proposals/utils";
import { getURLSearchParams } from "@politeiagui/core/router";

function New() {
  const dispatch = useDispatch();
  const { draft: draftid } = getURLSearchParams();

  const policy = useSelector(piPolicy.selectAll);
  // const { domains, startdatemin, enddatemax } = useSelector(piPolicy.selectAll);
  const draft = useSelector((state) =>
    recordsDrafts.selectById(state, { draftid, userid: "user-id-test" })
  );

  // Decode Form values for drafts
  const formValues = decodeProposalDraftForm(draft?.record);

  // Submission handlers
  function handleSubmit(data) {
    console.log(data);
  }
  function handleSave(data) {
    // TODO: Use logged in user id
    dispatch(
      recordsDrafts.save({ record: data, draftid, userid: "user-id-test" })
    );
  }

  return (
    <SingleContentPage banner={<H1>Create Proposal</H1>}>
      <ProposalForm
        onSave={handleSave}
        initialValues={formValues}
        onSubmit={handleSubmit}
        policy={policy}
      />
    </SingleContentPage>
  );
}

export default New;

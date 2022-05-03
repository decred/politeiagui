import React from "react";
import { RecordForm } from "@politeiagui/common-ui";
import { getStartEndDatesRange } from "../../utils/date";
import { Column, Row } from "pi-ui";
import styles from "./styles.module.css";
import ProposalRules from "./ProposalRules";
import {
  PROPOSAL_TYPE_REGULAR,
  PROPOSAL_TYPE_RFP,
  PROPOSAL_TYPE_SUBMISSION,
} from "../../pi";

const PROPOSAL_TYPE_OPTIONS = [
  { label: "Regular Proposal", value: PROPOSAL_TYPE_REGULAR },
  { label: "RFP Proposal", value: PROPOSAL_TYPE_RFP },
  { label: "RFP Submission", value: PROPOSAL_TYPE_SUBMISSION },
];

export function ProposalForm({
  onSubmit,
  onSave,
  initialValues,
  domains,
  maxEndDate,
  minStartDate,
}) {
  const domainsOptions = domains.map((domain) => ({
    label: domain.charAt(0).toUpperCase() + domain.slice(1),
    value: domain,
  }));
  const proposalYears = getStartEndDatesRange(minStartDate, maxEndDate);

  return (
    <RecordForm onSubmit={onSubmit} initialValues={initialValues}>
      {({
        CurrencyInput,
        DatePickerInput,
        TextInput,
        SelectInput,
        MarkdownInput,
        SubmitButton,
        SaveButton,
        Warning,
        formProps,
      }) => {
        const proposalType = formProps.watch("type");
        const isRfpProposal = proposalType?.value === PROPOSAL_TYPE_RFP;
        const isSubmission = proposalType?.value === PROPOSAL_TYPE_SUBMISSION;
        const isRfp = isRfpProposal || isSubmission;

        return (
          <div>
            <Warning>
              Drafts are saved locally to your browser and are not recoverable
              if something goes wrong. We recommend drafting the content offline
              then using the editor to submit the final version.
            </Warning>
            <Row>
              <Column xs={12} sm={!isRfp ? 12 : 6}>
                <SelectInput
                  options={PROPOSAL_TYPE_OPTIONS}
                  name="type"
                  placeholder="Proposal Type"
                />
              </Column>
              {isRfp && (
                <Column xs={12} sm={6}>
                  {isRfpProposal ? (
                    <DatePickerInput
                      name="deadline"
                      placeholder="Deadline"
                      years={proposalYears}
                    />
                  ) : (
                    <TextInput
                      name="rfpToken"
                      placeholder="RFP Proposal Token"
                    />
                  )}
                </Column>
              )}
            </Row>
            <TextInput name="name" placeholder="Proposal Name" />
            {!isRfpProposal && (
              <CurrencyInput name="amount" placeholder="Amount (USD)" />
            )}
            {!isRfpProposal && (
              <Row>
                <Column xs={12} md={6}>
                  <DatePickerInput
                    name="startDate"
                    placeholder="Start Date"
                    years={proposalYears}
                  />
                </Column>
                <Column xs={12} md={6}>
                  <DatePickerInput
                    name="endDate"
                    placeholder="End Date"
                    years={getStartEndDatesRange(minStartDate, maxEndDate)}
                  />
                </Column>
              </Row>
            )}
            <SelectInput
              options={domainsOptions}
              name="domain"
              placeholder="Domain"
            />
            <MarkdownInput name="body" />
            <ProposalRules />
            <div className={styles.formButtons}>
              <SaveButton onSave={onSave}>Save Draft</SaveButton>
              <SubmitButton />
            </div>
          </div>
        );
      }}
    </RecordForm>
  );
}

import React from "react";
import { RecordForm } from "@politeiagui/common-ui";
import { getStartEndDatesRange } from "../../utils/date";
import { Column, Row } from "pi-ui";
import styles from "./styles.module.css";
import ProposalRules from "./ProposalRules";

const PROPOSAL_TYPE_OPTIONS = [
  { label: "Regular Proposal", value: 1 },
  { label: "RFP Proposal", value: 2 },
  { label: "RFP Submission", value: 3 },
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

  return (
    <RecordForm onSubmit={onSubmit} initialValues={initialValues}>
      {({
        DatePickerInput,
        TextInput,
        SelectInput,
        MarkdownInput,
        SubmitButton,
        SaveButton,
        Warning,
      }) => {
        return (
          <div>
            <Warning>
              Drafts are saved locally to your browser and are not recoverable
              if something goes wrong. We recommend drafting the content offline
              then using the editor to submit the final version.
            </Warning>
            <SelectInput
              options={PROPOSAL_TYPE_OPTIONS}
              name="type"
              placeholder="Proposal Type"
            />
            <TextInput name="name" placeholder="Proposal Name" />
            <TextInput name="amount" placeholder="Amount (USD)" />
            <Row>
              <Column xs={12} md={6}>
                <DatePickerInput
                  name="startDate"
                  placeholder="Start Date"
                  years={getStartEndDatesRange(minStartDate, maxEndDate)}
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

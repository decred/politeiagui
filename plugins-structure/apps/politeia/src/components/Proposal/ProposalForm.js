import React from "react";
import { RecordForm } from "@politeiagui/common-ui";
import { getStartEndDatesRange } from "../../utils/date";

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
      }) => {
        return (
          <div>
            <SelectInput
              options={PROPOSAL_TYPE_OPTIONS}
              name="type"
              placeholder="Proposal Type"
            />
            <TextInput name="name" placeholder="Proposal Name" />
            <TextInput name="amount" placeholder="Amount (USD)" />
            <DatePickerInput
              name="startDate"
              placeholder="Start Date"
              years={getStartEndDatesRange(minStartDate, maxEndDate)}
            />
            <DatePickerInput
              name="endDate"
              placeholder="End Date"
              years={getStartEndDatesRange(minStartDate, maxEndDate)}
            />
            <SelectInput
              options={domainsOptions}
              name="domain"
              placeholder="Domain"
            />
            <MarkdownInput name="body" />
            <SaveButton onSave={onSave} />
            <SubmitButton />
          </div>
        );
      }}
    </RecordForm>
  );
}

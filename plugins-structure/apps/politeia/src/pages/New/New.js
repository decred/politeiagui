import React from "react";
import { RecordForm } from "@politeiagui/common-ui";

const PROPOSAL_TYPE_OPTIONS = [
  { label: "Regular Proposal", value: 1 },
  { label: "RFP Proposal", value: 2 },
  { label: "RFP Submission", value: 3 },
];

// TODO: Get domains from pi policy
const PROPOSAL_DOMAIN_OPTIONS = [
  { label: "Development", value: "development" },
  { label: "Marketing", value: "marketing" },
  { label: "Research", value: "research" },
  { label: "Design", value: "design" },
];

function New() {
  function handleSubmit(data) {
    console.log(data);
  }
  function handleSave(data) {
    console.log("saving...", data);
  }
  return (
    <RecordForm
      onSubmit={handleSubmit}
      initialValues={{ name: "", amount: "" }}
    >
      {({
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
            <SelectInput
              options={PROPOSAL_DOMAIN_OPTIONS}
              name="domain"
              placeholder="Domain"
            />
            <MarkdownInput name="body" />
            <SaveButton onSave={handleSave} />
            <SubmitButton />
          </div>
        );
      }}
    </RecordForm>
  );
}

export default New;

import React from "react";
import { RecordForm } from "@politeiagui/common-ui";
import { Column, Row, Text } from "pi-ui";
import styles from "./styles.module.css";
import ProposalRules from "./ProposalRules";
import {
  PROPOSAL_TYPE_REGULAR,
  PROPOSAL_TYPE_RFP,
  PROPOSAL_TYPE_SUBMISSION,
} from "../../pi";
import { convertProposalFormToRecordFiles } from "../../pi/proposals/utils";

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

  const now = Date.now();
  const minTimestamp = now + minStartDate * 1000;
  const maxTimestamp = now + maxEndDate * 1000;

  const handleSubmit = (fn) => (values) => {
    const files = convertProposalFormToRecordFiles(values);
    fn(files);
  };

  return (
    <RecordForm onSubmit={handleSubmit(onSubmit)} initialValues={initialValues}>
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
        const isRfpProposal = proposalType === PROPOSAL_TYPE_RFP;
        const isSubmission = proposalType === PROPOSAL_TYPE_SUBMISSION;
        const isRfp = isRfpProposal || isSubmission;

        return (
          <div>
            <Warning>
              Drafts are saved locally to your browser and are not recoverable
              if something goes wrong. We recommend drafting the content offline
              then using the editor to submit the final version.
            </Warning>
            <Row>
              <Column
                xs={12}
                sm={!isRfp ? 12 : 6}
                data-testid="proposal-form-type"
              >
                <SelectInput
                  autoFocus
                  tabIndex={1}
                  options={PROPOSAL_TYPE_OPTIONS}
                  name="type"
                  placeholder="Proposal Type"
                />
              </Column>
              {isRfp && (
                <Column xs={12} sm={6}>
                  {isRfpProposal ? (
                    <DatePickerInput
                      data-testid="proposal-form-rfp-deadline-input"
                      tabIndex={1}
                      minTimestamp={minTimestamp}
                      maxTimestamp={maxTimestamp}
                      name="deadline"
                      placeholder="Deadline"
                      tooltipInfo={
                        <Text className={styles.textTooltip}>
                          The deadline for the RFP submissions, it can be edited
                          at any point before the voting has been started and
                          should be at least two weeks from now.
                        </Text>
                      }
                    />
                  ) : (
                    <TextInput
                      tabIndex={1}
                      data-testid="proposal-form-rfp-token-input"
                      name="rfpToken"
                      placeholder="RFP Proposal Token"
                      tooltipInfo={
                        <Text className={styles.textTooltip}>
                          The token for the RFP you are submitting on, it can be
                          found on the RFP proposal page.
                        </Text>
                      }
                    />
                  )}
                </Column>
              )}
            </Row>
            <TextInput
              name="name"
              tabIndex={1}
              placeholder="Proposal Name"
              data-testid="proposal-form-name-input"
            />
            {!isRfpProposal && (
              <CurrencyInput
                name="amount"
                tabIndex={1}
                data-testid="proposal-form-amount-input"
                placeholder="Amount (USD)"
              />
            )}
            {!isRfpProposal && (
              <Row>
                <Column xs={12} md={6}>
                  <DatePickerInput
                    minTimestamp={minTimestamp}
                    maxTimestamp={maxTimestamp}
                    tabIndex={1}
                    data-testid="proposal-form-start-date-input"
                    name="startDate"
                    placeholder="Start Date"
                  />
                </Column>
                <Column xs={12} md={6}>
                  <DatePickerInput
                    minTimestamp={minTimestamp}
                    maxTimestamp={maxTimestamp}
                    tabIndex={1}
                    data-testid="proposal-form-end-date-input"
                    name="endDate"
                    placeholder="End Date"
                  />
                </Column>
              </Row>
            )}
            <div data-testid="proposal-form-domain">
              <SelectInput
                tabIndex={1}
                options={domainsOptions}
                name="domain"
                placeholder="Domain"
              />
            </div>
            <MarkdownInput
              initialValue={initialValues?.body}
              name="body"
              tabIndex={1}
              data-testid="proposal-form-markdown-input"
            />
            <ProposalRules />
            <div className={styles.formButtons}>
              <SaveButton
                tabIndex={1}
                onSave={handleSubmit(onSave)}
                data-testid="proposal-form-save-draft-button"
              >
                Save Draft
              </SaveButton>
              <SubmitButton
                tabIndex={1}
                data-testid="proposal-form-submit-button"
              />
            </div>
          </div>
        );
      }}
    </RecordForm>
  );
}

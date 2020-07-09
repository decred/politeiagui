import React, { useCallback } from "react";
import SelectEditor from "./components/SelectEditor";
import TextArea from "./components/TextArea";
import LazySelector from "./components/LazySelector";
import { isEmpty } from "src/helpers";
import { Spinner } from "pi-ui";
import useApprovedProposals from "src/hooks/api/useApprovedProposals";

import { multilineCellValue, textWrapper } from "./InvoiceDatasheet.module.css";

const PROPOSAL_PAGE_SIZE = 20;

export const selectWrapper = (options) => (props) => (
  <SelectEditor {...{ ...props, options }} />
);

export const textAreaWrapper = () => (props) => (
  <div className={textWrapper}>
    <TextArea {...props} />
  </div>
);

export const multilineTextWrapper = () => ({ value }) => (
  <div className={multilineCellValue}>{value}</div>
);

export const proposalViewWrapper = (proposals) => ({ cell: { value } }) => {
  const findProposal = useCallback(
    (v) => proposals && proposals.find((p) => p.value === v),
    []
  );

  const selectedProposal = findProposal(value);

  return (
    <>
      {!isEmpty(value) && !selectedProposal && <Spinner invert />}
      <span>{selectedProposal && selectedProposal.label}</span>
    </>
  );
};

export const proposalSelectWrapper = (options) => (props) => {
  const {
    remainingTokens,
    onFetchRemainingProposalsBatch,
    error
  } = useApprovedProposals();

  const onLoadMoreOptions = useCallback(() => {
    onFetchRemainingProposalsBatch(PROPOSAL_PAGE_SIZE);
  }, [onFetchRemainingProposalsBatch]);

  return (
    <LazySelector
      options={options}
      onFetch={onLoadMoreOptions}
      needsFetch={remainingTokens.length > 0}
      error={error}
      {...props}
    />
  );
};

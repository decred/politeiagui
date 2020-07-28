import React, { useCallback } from "react";
import SelectEditor from "./components/SelectEditor";
import TextArea from "./components/TextArea";
import {
  multilineCellValue,
  textWrapper,
  highlightChar
} from "./InvoiceDatasheet.module.css";
import { buildSimpleMatchRegexFromSupportedChars } from "src/utils/validation";
import LazySelector from "./components/LazySelector";
import { isEmpty } from "src/helpers";
import { Spinner } from "pi-ui";
import useApprovedProposals from "src/hooks/api/useApprovedProposals";

const PROPOSAL_PAGE_SIZE = 20;

export const selectWrapper = (options) => (props) => (
  <SelectEditor {...{ ...props, options }} />
);

export const textAreaWrapper = () => (props) => (
  <div className={textWrapper}>
    <TextArea {...props} />
  </div>
);

const printHighlightingUnsupported = (uniqueUnmatched, value, isMultiline) => {
  return (
    <div className={isMultiline ? multilineCellValue : ""}>
      {value
        .split("")
        .map((v) =>
          uniqueUnmatched.has(v) ? (
            <span className={highlightChar}>{v}</span>
          ) : (
            v
          )
        )}
    </div>
  );
};

const getUnmatchedSet = (supportedChars, value) => {
  const re = buildSimpleMatchRegexFromSupportedChars(supportedChars);
  const unmatched = value.replace(re, "");
  const uniqueUnmatched = new Set(unmatched);
  return uniqueUnmatched;
};

export const multilineTextWrapper = (supportedChars) => ({ value }) => {
  const uniqueUnmatched = getUnmatchedSet(supportedChars, value);
  return printHighlightingUnsupported(uniqueUnmatched, value, true);
};

export const singlelineTextWrapper = (supportedChars) => ({ value }) => {
  const uniqueUnmatched = getUnmatchedSet(supportedChars, value);
  return printHighlightingUnsupported(uniqueUnmatched, value, false);
};

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

import React, { useCallback } from "react";
import SelectEditor from "./components/SelectEditor";
import TextArea from "./components/TextArea";
import {
  multilineCellValue,
  textWrapper,
  highlightChar
} from "./InvoiceDatasheet.module.css";
import { buildSimpleMatchRegexFromSupportedChars } from "src/utils/validation";
import { isEmpty } from "src/helpers";
import { Spinner } from "pi-ui";

export const selectWrapper = (options) => (props) => (
  <SelectEditor {...{ ...props, options }} />
);

export const textWithErrorWrapper = (error) => ({ value, ...props }) => {
  return error ? (
    <span className={highlightChar}>{error.toString()}</span>
  ) : (
    <span {...props}>{value}</span>
  );
};

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

export const proposalViewWrapper = (proposals, proposalsError) => ({
  cell: { value }
}) => {
  const findProposal = useCallback(
    (v) => proposals && proposals.find((p) => p.value === v),
    []
  );
  const selectedProposal = findProposal(value);
  const isLoading = !isEmpty(value) && !selectedProposal && !proposalsError;
  return (
    <>
      {isLoading && <Spinner invert />}
      {proposalsError && (
        <span className={highlightChar}>{proposalsError.toString()}</span>
      )}
      {selectedProposal && <span>{selectedProposal.label}</span>}
    </>
  );
};

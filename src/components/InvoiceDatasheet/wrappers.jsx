import React from "react";
import SelectEditor from "./components/SelectEditor";
import TextArea from "./components/TextArea";
import {
  multilineCellValue,
  textWrapper,
  highlightChar
} from "./InvoiceDatasheet.module.css";
import { buildSimpleMatchRegexFromSupportedChars } from "src/utils/validation";

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
      {value.split("").map((v) => {
        return uniqueUnmatched.has(v) ? (
          <span className={highlightChar}>{v}</span>
        ) : (
          v
        );
      })}
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

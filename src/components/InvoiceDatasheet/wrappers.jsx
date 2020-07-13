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

export const multilineTextWrapper = (supportedChars) => ({ value }) => {
  const re = buildSimpleMatchRegexFromSupportedChars(supportedChars);
  const unmatched = value.replace(re, "");
  const uniqueUnmatched = new Set(unmatched);
  return (
    <div className={multilineCellValue}>
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

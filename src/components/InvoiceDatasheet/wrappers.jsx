import React from "react";
import SelectEditor from "./components/SelectEditor";
import TextArea from "./components/TextArea";
import { multilineCellValue, textWrapper } from "./InvoiceDatasheet.module.css";

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

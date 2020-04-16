import React from "react";
import SelectEditor from "./components/SelectEditor";
import TextArea from "./components/TextArea";
import { multilineCellValue } from "./InvoiceDatasheet.module.css";

export const selectWrapper = (options) => (props) => (
  <SelectEditor {...{ ...props, options }} />
);

export const textAreaWrapper = () => (props) => (
  <TextArea {...props }/>
);

export const multilineTextWrapper = () => (props) => (
  <div className={multilineCellValue}>
    {props.value}
  </div>
);

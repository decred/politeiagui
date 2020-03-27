import React from "react";
import SelectEditor from "./components/SelectEditor";

export const selectWrapper = (options) => (props) => (
  <SelectEditor {...{ ...props, options }} />
);

import React from "react";
import { CustomConfigProvider } from "src/containers/Config";
import { constants } from "../Config/helpers";

const customConfigDcc = {
  recordType: constants.RECORD_TYPE_DCC
};

export const DccProvider = ({ children }) => (
  <CustomConfigProvider {...{ children, ...customConfigDcc }} />
);

export const withDcc = (Component) => (props) =>
  (
    <CustomConfigProvider {...customConfigDcc}>
      <Component {...props} />
    </CustomConfigProvider>
  );

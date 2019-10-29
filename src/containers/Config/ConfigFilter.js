import React from "react";
import PropTypes from "prop-types";
import { ConfigConsumer } from "./ConfigProvider";

const ConfigFilter = ({ showIf, children }) => (
  <ConfigConsumer>
    {config => (showIf(config) ? children : null)}
  </ConfigConsumer>
);

ConfigFilter.propTypes = {
  showIf: PropTypes.func.isRequired,
  children: PropTypes.node
};

export default ConfigFilter;

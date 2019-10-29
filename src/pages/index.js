import React from "react";
import { useConfig } from "src/containers/Config";
import RoutesPoliteia from "./Routes";
import RoutesCMS from "./RoutesCMS";

const Root = () => {
  const { recordType, constants } = useConfig();
  const mapRecordTypeToRoutes = {
    [constants.RECORD_TYPE_INVOICE]: <RoutesCMS />,
    [constants.RECORD_TYPE_PROPOSAL]: <RoutesPoliteia />
  };
  return mapRecordTypeToRoutes[recordType];
};

export default Root;

import React from "react";
import { useConfig } from "src/containers/Config";
import { useSelector } from "src/redux";
import * as sel from "src/selectors";
import RoutesPoliteia from "./Routes";
import RoutesCMS from "./RoutesCMS";
import { classNames, useTheme, DEFAULT_DARK_THEME_NAME } from "pi-ui";


const Root = () => {
  const isTestnet = useSelector(sel.isTestNet);
  const { recordType, constants } = useConfig();
  const { themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;
  const mapRecordTypeToRoutes = {
    [constants.RECORD_TYPE_INVOICE]: <RoutesCMS />,
    [constants.RECORD_TYPE_PROPOSAL]: <RoutesPoliteia />
  };
  const url = `https://${
    isTestnet ? "test-proposals" : "proposals"
  }.decred.org`;
  return (
  <>
    <div className={classNames("archive-banner", isDarkTheme && "archive-banner__dark" )}>
      <p>You are on the archived proposals website. <a href={url} className="archive-banner__link">Click here</a> to go to Politeia.</p>
    </div>
    {mapRecordTypeToRoutes[recordType]}
  </>);
};

export default Root;

import React, { lazy, Suspense } from "react";
import PageNotFound from "./NotFound";

const PageProposalsNew = lazy(() =>
  import(/* webpackChunkName: "PageProposalsNew" */ "./Proposals/New")
);
const PageInvoicesNew = lazy(() =>
  import(/* webpackChunkName: "PageInvoicesNew" */ "./Invoices/New")
);
const PageProposalEdit = lazy(() =>
  import(/* webpackChunkName: "PageProposalEdit" */ "./Proposals/Edit")
);
const PageInvoiceEdit = lazy(() =>
  import(/* webpackChunkName: "PageInvoiceEdit" */ "./Invoices/Edit")
);
/** This adds the first example of how we should manage routing to different componentes based
 * on the record type specified in the config. More renderers will be moved here as we progress
 * on building the componenents for different record types such as invoices.
 */

const renderComponent = (componentMap, recordType, props) => {
  const Component = componentMap[recordType] || PageNotFound;
  // TODO: set a proper designed fallback UI
  return (
    <Suspense fallback={<div />}>
      <Component {...props} />
    </Suspense>
  );
};

export const renderNewRecordRoute =
  ({ recordType, constants }) =>
  (props) => {
    const mapRecordTypeToComponent = {
      [constants.RECORD_TYPE_INVOICE]: PageInvoicesNew,
      [constants.RECORD_TYPE_PROPOSAL]: PageProposalsNew
    };
    return renderComponent(mapRecordTypeToComponent, recordType, props);
  };

export const renderEditRecordRoute =
  ({ recordType, constants }) =>
  (props) => {
    const mapRecordTypeToComponent = {
      [constants.RECORD_TYPE_INVOICE]: PageInvoiceEdit,
      [constants.RECORD_TYPE_PROPOSAL]: PageProposalEdit
    };
    return renderComponent(mapRecordTypeToComponent, recordType, props);
  };

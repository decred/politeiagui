import React, { lazy, Suspense } from "react";
import ProposalFormLoader from "./ProposalFormLoader";

const ProposalForm = lazy(() =>
  import(/* webpackChunkName: "ProposalForm" */ "./ProposalForm")
);

const ProposalFormLazy = props => (
  <Suspense fallback={<ProposalFormLoader />}>
    <ProposalForm {...props} />
  </Suspense>
);

export default ProposalFormLazy;

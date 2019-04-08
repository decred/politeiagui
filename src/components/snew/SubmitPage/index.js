import React, { lazy, Suspense } from "react";
import PageLoadingIcon from "../PageLoadingIcon";
import submitFormHOC from "../../../hocs/submitForm";

const Invoice = lazy(() => import("./SubmitPageInvoice"));
const Proposal = lazy(() => import("./SubmitPageProposal"));

const SubmitPage = ({ isCMS, ...props }) => (
  <Suspense fallback={<PageLoadingIcon />}>
    {isCMS ? <Invoice {...props} /> : <Proposal {...props} />}
  </Suspense>
);

export default submitFormHOC(SubmitPage);

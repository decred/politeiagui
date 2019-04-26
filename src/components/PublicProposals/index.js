import React, { lazy, Suspense } from "react";
import FallbackUI from "../ListPageFallbackUI";

const PublicProposals = lazy(() => import("./PublicProposals"));

const PublicProposalsWrapper = () => (
  <Suspense fallback={<FallbackUI />}>
    <PublicProposals />
  </Suspense>
);

export default PublicProposalsWrapper;

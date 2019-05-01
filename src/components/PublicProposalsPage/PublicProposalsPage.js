import React, { lazy, Suspense } from "react";
import FallbackUI from "../ListPageFallbackUI";
import ErrorBoundary from "../ErrorBoundary";

const PublicProposals = lazy(() => import("./PublicProposals"));

const PublicProposalsPage = () => (
  <Suspense fallback={<FallbackUI />}>
    <div className="content">
      <h1 className="content-title">Public Proposals</h1>
      <ErrorBoundary title="Failed to fetch public proposals">
        <PublicProposals />
      </ErrorBoundary>
    </div>
  </Suspense>
);

export default PublicProposalsPage;

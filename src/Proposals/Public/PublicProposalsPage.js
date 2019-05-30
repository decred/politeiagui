import React from "react";
import ErrorBoundary from "src/components/ErrorBoundary";
import { PublicProposals } from "./PublicProposals";

export const PublicProposalsPage = () => (
  <div className="content">
    <h1 className="content-title">Public Proposals</h1>
    <ErrorBoundary title="Failed to fetch public proposals">
      <PublicProposals />
    </ErrorBoundary>
  </div>
);

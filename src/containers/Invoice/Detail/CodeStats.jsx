import React, { Fragment } from "react";
import { H4, Text, Table, Spinner } from "pi-ui";

import Link from "src/components/Link";
import { useCodeStats } from "./hooks";
import styles from "./Detail.module.css";

const headers = [
  "Date",
  "Repo",
  "Merge Additions",
  "Merge Deletions",
  "PRs",
  "Review Additions",
  "Review Deletions",
  "Reviews"
];

const getPRnumber = (lastIndex) => (prUrl, i) => {
  const url = new URL(prUrl);
  /**
   * Why use 4 for the array indexing here?
   * URL: https://github.com/decred/politeiagui/pull/2024
   * Pathname: /decred/politeiagui/pull/2024
   * Split: ["", "decred", "politeiagui", "pull", "2024"]
   */
  const prNumber = url.pathname.split("/")[4];
  return (
    <Fragment key={i}>
      <Link to={{ pathname: prUrl }} target="_blank">
        {prNumber}
      </Link>
      {i === lastIndex ? "" : ","}
    </Fragment>
  );
};

const printCodeStatsInfo = ({
  repository,
  mergeadditions,
  mergedeletions,
  reviewadditions,
  reviewdeletions,
  prs,
  reviews,
  month,
  year
}) => ({
  Date: `${month}/${year}`,
  Repo: repository,
  "Merge Additions": mergeadditions,
  "Merge Deletions": mergedeletions,
  PRs: (
    <Text className={styles.prs}>
      {prs.length === 0 ? "none" : prs.map(getPRnumber(prs.length - 1))}
    </Text>
  ),
  "Review Additions": reviewadditions,
  "Review Deletions": reviewdeletions,
  Reviews: (
    <Text className={styles.prs}>
      {reviews.length === 0
        ? "none"
        : reviews.map(getPRnumber(reviews.length - 1))}
    </Text>
  )
});

// TODO: code when the codestats endpoint is fixed
const CodeStats = ({ userid, start, end }) => {
  const { loading, error, codestats } = useCodeStats(userid, start, end);
  const shouldPrintTable =
    !loading && !error && codestats && codestats.length > 0;
  const shouldPrintEmptyMessage =
    !loading && !error && codestats && codestats.length === 0;
  const shouldPrintErrorMessage = !loading && error && !codestats;
  return (
    <>
      <H4 className="margin-top-m">Past 3 months code stats</H4>
      {shouldPrintTable ? (
        <Table headers={headers} data={codestats.map(printCodeStatsInfo)} />
      ) : shouldPrintEmptyMessage ? (
        <Text>No code stats for the past 3 months</Text>
      ) : shouldPrintErrorMessage ? (
        <Text>Error fetching codestats. Err: {error}</Text>
      ) : (
        <Spinner />
      )}
    </>
  );
};

export default CodeStats;

import React, { Fragment, useState, memo } from "react";
import { H4, Text, Table, Spinner, Link as UiLink, classNames } from "pi-ui";
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
  "Commits Additions",
  "Commits Deletions",
  "Update Additions",
  "Update Deletions",
  "Reviews"
];

/**
 * PRs
 * URL: https://github.com/decred/politeiagui/pull/2024
 * Pathname: /decred/politeiagui/pull/2024
 * Split: ["", "decred", "politeiagui", "pull", "2024"]
 * Commits
 * URL: https://api.github.com/repos/decred/politeiagui/commits/1688505e91dc86e5f2251cdd72fdcb53fa5bfd99
 * Pathname: repos/decred/politeiagui/commits/1688505e91dc86e5f2251cdd72fdcb53fa5bfd99
 * Split: ["", "repos", "decred", "politeiagui", "commits", "1688505e91dc86e5f2251cdd72fdcb53fa5bfd99"]
 */
const getUrlEnd = (lastIndex, numberPos = 4, shortUrl = false) => (
  prUrl,
  i
) => {
  const url = new URL(prUrl);
  const prNumber = url.pathname.split("/")[numberPos];
  return (
    <Fragment key={i}>
      <Link to={{ pathname: prUrl }} target="_blank">
        {shortUrl ? prNumber.substring(0, 7) : prNumber}
      </Link>
      {i === lastIndex ? "" : ", "}
    </Fragment>
  );
};

const printCodeStatsInfo = ({
  commitadditions,
  commitdeletions,
  updatedadditions,
  updateddeletions,
  repository,
  mergedadditions,
  mergeddeletions,
  reviewadditions,
  reviewdeletions,
  prs,
  reviews,
  month,
  year
}) => ({
  Date: `${month}/${year}`,
  Repo: repository,
  "Merge Additions": mergedadditions,
  "Merge Deletions": mergeddeletions,
  PRs: (
    <Text className={styles.prs}>
      {prs.length === 0 ? "none" : prs.map(getUrlEnd(prs.length - 1, 4))}
    </Text>
  ),
  "Review Additions": reviewadditions,
  "Review Deletions": reviewdeletions,
  "Commits Additions": commitadditions,
  "Commits Deletions": commitdeletions,
  "Update Additions": updatedadditions,
  "Update Deletions": updateddeletions,
  Reviews: (
    <Text className={styles.prs}>
      {reviews.length === 0
        ? "none"
        : reviews.map(getUrlEnd(reviews.length - 1))}
    </Text>
  )
});

const CodeStats = ({ userid, start, end }) => {
  const { loading, error, codestats } = useCodeStats(userid, start, end);
  const [showStats, setShowStats] = useState(false);
  const toggleShowStats = () => setShowStats(!showStats);
  const shouldPrintTable =
    showStats && !loading && !error && codestats && codestats.length > 0;
  const shouldPrintEmptyMessage =
    !loading && !error && codestats && codestats.length === 0;
  const shouldPrintLoading = showStats && loading;
  const shouldPrintErrorMessage = !loading && error && !codestats;
  return (
    <>
      <div className={classNames(styles.titleLinkWrapper, "margin-top-m")}>
        <H4>Past 3 months code stats</H4>
        <UiLink className={styles.uilink} onClick={toggleShowStats}>
          {shouldPrintEmptyMessage ? "" : showStats ? "Hide" : "Show"}
        </UiLink>
      </div>
      {shouldPrintTable ? (
        <>
          <Table headers={headers} data={codestats.map(printCodeStatsInfo)} />
          <H4 className="margin-bottom-s">Commits:</H4>
          {codestats.map((cs, i) => (
            <Text className={styles.prs} key={i}>
              {cs.commits.length === 0
                ? "none"
                : cs.commits.map(getUrlEnd(cs.commits.length - 1, 5, true))}
            </Text>
          ))}
        </>
      ) : shouldPrintEmptyMessage ? (
        <Text>No code stats for the past 3 months</Text>
      ) : shouldPrintErrorMessage ? (
        <Text>Error fetching codestats. Err: {error}</Text>
      ) : (
        shouldPrintLoading && <Spinner />
      )}
    </>
  );
};

export default memo(CodeStats);

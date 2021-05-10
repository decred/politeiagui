import React, { Fragment, useState, memo } from "react";
import { H4, H5, Text, Spinner, classNames } from "pi-ui";
import Link from "src/components/Link";
import useUserDetail from "src/hooks/api/useUserDetail";
import { useCodeStats, useFetchCodeStats } from "./hooks";
import styles from "./Detail.module.css";

const headers = ["Date", "Repo", "Commits", "Merged", "Updates", "Reviews"];

const Headers = () => (
  <div className={classNames(styles.statsHeader, styles.collapse)}>
    {headers.map((h, i) => (
      <span key={i}>{h}</span>
    ))}
  </div>
);

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
const getUrlEnd =
  (lastIndex, numberPos = 4) =>
  (prUrl, i) => {
    const url = new URL(prUrl);
    const prNumber = url.pathname.split("/")[numberPos];
    return (
      <Fragment key={i}>
        <Link to={{ pathname: prUrl }} target="_blank">
          {prNumber.substring(0, 7)}
        </Link>
        {i === lastIndex ? "" : ", "}
      </Fragment>
    );
  };

const Statistic = ({ add, del }) => (
  <div className={styles.singleStat}>
    <div className={styles.addition}>+ {add}</div>
    <div className={styles.deletion}>- {del}</div>
  </div>
);

const ContributionList = ({ links, label, pos = 4 }) => (
  <div>
    {label}:{" "}
    <Text className={styles.prs}>
      {links.length === 0
        ? "none"
        : links.map(getUrlEnd(links.length - 1, pos, true))}
    </Text>
  </div>
);

const CodeStatDetails = ({
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
  commits,
  month,
  year
}) => {
  const [show, setShow] = useState(false);
  const onToggleShow = () => setShow(!show);
  return (
    <>
      <div className={styles.collapse} onClick={onToggleShow}>
        <Text textAlign="center">{`${month}/${year}`}</Text>
        <Text textAlign="center">{repository}</Text>
        <Statistic add={commitadditions} del={commitdeletions} />
        <Statistic add={mergedadditions} del={mergeddeletions} />
        <Statistic add={updatedadditions} del={updateddeletions} />
        <Statistic add={reviewadditions} del={reviewdeletions} />
      </div>
      {show && (
        <div className={styles.contributionDetails}>
          <ContributionList links={prs} label="Pull Requests" />
          <ContributionList links={reviews} label="Reviews" />
          <ContributionList links={commits} pos={5} label="Commits" />
        </div>
      )}
    </>
  );
};

export const FetchCodeStats = ({ id, start, end }) => {
  const { loading, error } = useFetchCodeStats(id, start, end);
  return loading ? (
    <Spinner />
  ) : error ? (
    <Text>Error fetching codestats. Err: {error}</Text>
  ) : null;
};

const IndividualCodeStats = ({ id, start, end }) => {
  const { user } = useUserDetail(id);
  const { codestats } = useCodeStats(id, start, end);
  const shouldPrintTable = codestats && codestats.length > 0;
  const shouldPrintEmptyMessage = codestats && codestats.length === 0;
  return (
    <>
      {!codestats && <FetchCodeStats id={id} start={start} end={end} />}
      <H5 className="margin-top-s">{user && user.username}</H5>
      {shouldPrintTable ? (
        <div className={styles.codeStats}>
          <Headers />
          {codestats.map((cs, i) => (
            <CodeStatDetails {...cs} key={i} />
          ))}
        </div>
      ) : (
        shouldPrintEmptyMessage && (
          <Text>No code stats for this user in the past 3 months</Text>
        )
      )}
    </>
  );
};

const CodeStats = ({ ids, start, end }) => {
  return (
    <>
      <div
        className={classNames(
          styles.titleLinkWrapper,
          "margin-top-m",
          "margin-bottom-s"
        )}>
        <H4>Past 3 months code stats</H4>
      </div>
      {ids.map((id) => (
        <IndividualCodeStats key={id} id={id} start={start} end={end} />
      ))}
    </>
  );
};

export default memo(CodeStats);

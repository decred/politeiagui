import React, { useMemo, useRef } from "react";
import PropTypes from "prop-types";
import { matchPath } from "react-router-dom";
import { Link, classNames, useTheme, DEFAULT_DARK_THEME_NAME } from "pi-ui";
import { useRouter } from "src/components/Router";
import styles from "./GoBackLink.module.css";
import findIndex from "lodash/fp/findIndex";

const backArrow = <>&#8592;</>;

function isExactMatch(match) {
  return match?.isExact;
}

const GoBackLink = ({ label, hierarchy, rootLink, breakpoint }) => {
  const { themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;
  const { history, navigationHistory } = useRouter();
  const hierarchyRef = useRef(hierarchy);
  const previousHierarchyLink = useMemo(() => {
    if (!hierarchyRef.current) return;
    const hierarchyMatches = hierarchyRef.current.map((path) =>
      matchPath(history.location.pathname, {
        path,
        strict: true
      })
    );
    const currentIndex = hierarchyMatches.findIndex(isExactMatch);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : 0;
    const previousMatch = hierarchyMatches[previousIndex];
    return previousMatch.url;
  }, [history]);

  const previousDefaultLinkIndex = useMemo(
    () =>
      findIndex(
        (prev) =>
          !matchPath(prev.pathname, {
            path: breakpoint,
            strict: true
          })
      )(navigationHistory),
    [navigationHistory, breakpoint]
  );

  return !previousHierarchyLink &&
    !rootLink &&
    previousDefaultLinkIndex < 0 ? null : (
    <div className={styles.returnLinkContainer}>
      <Link
        className={classNames(
          styles.returnLink,
          isDarkTheme && styles.darkReturnLink
        )}
        onClick={() =>
          previousHierarchyLink
            ? history.push(previousHierarchyLink)
            : rootLink
            ? history.push(rootLink)
            : history.go(-(previousDefaultLinkIndex + 1))
        }>
        {backArrow} {label}
      </Link>
    </div>
  );
};

GoBackLink.propTypes = {
  label: PropTypes.string,
  hierarchy: PropTypes.arrayOf(PropTypes.string),
  rootLink: PropTypes.string,
  breakpoint: PropTypes.string
};

GoBackLink.defaultProps = {
  label: "Go Back"
};

export default GoBackLink;

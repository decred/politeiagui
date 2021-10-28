import React, { useMemo, useRef } from "react";
import PropTypes from "prop-types";
import { matchPath } from "react-router-dom";
import { Link, classNames, useTheme, DEFAULT_DARK_THEME_NAME } from "pi-ui";
import { useRouter } from "src/components/Router";
import styles from "./GoBackLink.module.css";

const backArrow = <>&#8592;</>;

function isExactMatch(match) {
  return match?.isExact;
}

const GoBackLink = ({ label, hierarchy }) => {
  const { themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;
  const { history } = useRouter();
  const hierarchyRef = useRef(hierarchy);

  const previousLink = useMemo(() => {
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

  return (
    <div className={styles.returnLinkContainer}>
      <Link
        className={classNames(
          styles.returnLink,
          isDarkTheme && styles.darkReturnLink
        )}
        onClick={() =>
          previousLink ? history.push(previousLink) : history.goBack()
        }>
        {backArrow} {label}
      </Link>
    </div>
  );
};

GoBackLink.propTypes = {
  label: PropTypes.string,
  hierarchy: PropTypes.arrayOf(PropTypes.string)
};

GoBackLink.defaultProps = {
  label: "Go Back",
  hierarchy: ["/"]
};

export default GoBackLink;

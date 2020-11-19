import React, { useMemo } from "react";
import { Link, classNames, useTheme, DEFAULT_DARK_THEME_NAME } from "pi-ui";
import { useRouter } from "src/components/Router";
import styles from "./GoBackLink.module.css";

const backArrow = <>&#8592;</>;

const GoBackLink = () => {
  const { themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;
  const { pastLocations, history } = useRouter();
  const previousLocation = pastLocations[1];

  const goBackLinkFromPreviousLocation = useMemo(() => {
    if (!previousLocation) return null;
    return (
      <div className={styles.returnLinkContainer}>
        <Link
          className={classNames(
            styles.returnLink,
            isDarkTheme && styles.darkReturnLink
          )}
          onClick={() => history.goBack()}>
          {backArrow} Go back
        </Link>
      </div>
    );
  }, [previousLocation, isDarkTheme, history]);

  return goBackLinkFromPreviousLocation;
};

export default GoBackLink;

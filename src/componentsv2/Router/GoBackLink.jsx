import React, { useMemo, useCallback } from "react";
import { Link, classNames, useTheme } from "pi-ui";
import { useRouter } from "src/componentsv2/Router";
import styles from "./GoBackLink.module.css";

const GoBackLink = () => {
  const { themeName } = useTheme();
  const isDarkTheme = themeName === "dark";
  const { pastLocations, history } = useRouter();
  const previousLocation = pastLocations[1];
  const returnToPreviousLocation = useCallback(() => history.goBack(), [
    history
  ]);

  const goBackLinkFromPreviousLocation = useMemo(() => {
    if (!previousLocation) return null;
    return (
      <div className={styles.returnLinkContainer}>
        <Link
          className={classNames(
            styles.returnLink,
            isDarkTheme && styles.darkReturnLink
          )}
          onClick={returnToPreviousLocation}
        >
          &#8592; Go back
        </Link>
      </div>
    );
  }, [previousLocation, returnToPreviousLocation, isDarkTheme]);

  return goBackLinkFromPreviousLocation;
};

export default GoBackLink;

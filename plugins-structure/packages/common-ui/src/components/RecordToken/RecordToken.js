import React from "react";
import { CopyableText, Icon, Text, useMediaQuery } from "pi-ui";
import styles from "./styles.module.css";

export const RecordToken = ({ token, isCopyable }) => {
  const shouldPlaceTooltipLeft = useMediaQuery("(max-width: 560px)");
  return (
    <div className={styles.recordToken}>
      {isCopyable && (
        <CopyableText
          id={`proposal-token-${token}`}
          data-testid="record-token"
          truncate
          tooltipPlacement={shouldPlaceTooltipLeft ? "left" : "bottom"}
        >
          {token}
        </CopyableText>
      )}
      {!isCopyable && (
        <>
          <Icon type="sign" className="margin-right-xs" />
          <Text id={`proposal-token-${token}`} truncate>
            {token}
          </Text>
        </>
      )}
    </div>
  );
};

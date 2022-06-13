import React from "react";
import styles from "../Credits.module.css";
import {
  Text,
  P,
  Button,
  classNames,
  useTheme,
  DEFAULT_DARK_THEME_NAME
} from "pi-ui";

export default ({
  isPaid,
  isUser,
  isAdmin,
  openPaywallModal,
  isApiRequestingMarkAsPaid,
  openMarkAsPaidModal
}) => {
  const { themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;
  return (
    <div className={styles.block}>
      <div className={styles.blockDetails}>
        <Text
          className={classNames(styles.title, isDarkTheme && styles.darkTitle)}
        >
          Registration fee
        </Text>
        <Text
          size="large"
          className={classNames(
            styles.status,
            "margin-top-xs margin-bottom-xs"
          )}
        >
          {isPaid ? "Paid" : "Not paid"}
        </Text>
        {!isPaid && isUser && (
          <Button className="margin-top-s" size="sm" onClick={openPaywallModal}>
            Pay registration fee
          </Button>
        )}
        {!isPaid && isAdmin && (
          <Button
            data-testid="mark-paid"
            className="margin-top-s"
            loading={isApiRequestingMarkAsPaid}
            size="sm"
            onClick={openMarkAsPaidModal}
          >
            Mark as paid
          </Button>
        )}
      </div>
      <div className={styles.description}>
        <P
          className={classNames(
            styles.descriptionParagraph,
            isDarkTheme && styles.darkDescriptionParagraph
          )}
        >
          <b>Registration Fee:</b> In order to participate on proposals and to
          submit your own, Politeia requires a small registration fee of
          <b> exactly 0.1 DCR.</b>
        </P>
      </div>
    </div>
  );
};

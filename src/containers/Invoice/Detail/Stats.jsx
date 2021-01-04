import React, { memo } from "react";
import { Card, H2 } from "pi-ui";
import CodeStats from "./CodeStats";
import InvoiceDetails from "./InvoiceDetails";
import styles from "./Detail.module.css";
import { isUserDeveloper } from "src/containers/DCC/helpers";
import useUserDetail from "src/hooks/api/useUserDetail";

const Stats = ({ invoiceToken, userid, start, end }) => {
  const { user } = useUserDetail(userid);
  return (
    <Card paddingSize="small">
      <H2 className={styles.statsTitle}>Stats</H2>
      <InvoiceDetails
        start={start}
        end={end}
        token={invoiceToken}
        userid={userid}
      />
      {isUserDeveloper(user) && (
        <CodeStats userid={userid} start={start} end={end} />
      )}
    </Card>
  );
};

export default memo(Stats);

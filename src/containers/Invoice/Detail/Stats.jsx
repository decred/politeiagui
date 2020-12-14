import React, { memo } from "react";
import { Card, H2 } from "pi-ui";
import CodeStats from "./CodeStats";
import InvoiceDetails from "./InvoiceDetails";
import styles from "./Detail.module.css";
import { isUserDeveloper } from "src/containers/DCC/helpers";
import useUserDetail from "src/hooks/api/useUserDetail";

const Stats = ({ invoiceToken, userid }) => {
  const { user } = useUserDetail(userid);
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 3);
  const starttimestamp = Math.round(start.valueOf() / 1000);
  const endtimestamp = Math.round(end.valueOf() / 1000);
  return (
    <Card paddingSize="small">
      <H2 className={styles.statsTitle}>Stats</H2>
      <InvoiceDetails
        start={starttimestamp}
        end={endtimestamp}
        token={invoiceToken}
        userid={userid}
      />
      {isUserDeveloper(user) && (
        <CodeStats userid={userid} start={starttimestamp} end={endtimestamp} />
      )}
    </Card>
  );
};

export default memo(Stats);

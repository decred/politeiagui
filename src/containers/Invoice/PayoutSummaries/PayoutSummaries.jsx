import React, { useState, useCallback } from "react";
import { Link } from "pi-ui";
import { Row } from "src/componentsv2/layout";
import { PayoutsDateRange } from "src/componentsv2/PayoutsDateRange";

const InvoicePayoutsList = ({ TopBanner, PageDetails, Main }) => {

  const [dates, setDates] = useState({});
  console.log(dates);
  const handleDatesChange = useCallback(
    (values) => {
      setDates(values);
    },
    [setDates]
  );

  return (
    <>
      <TopBanner>
        <PageDetails
          title="Line Item Payouts"
          actionsContent={<Row><Link className="cursor-pointer">Export To Csv</Link></Row>}
        >
          <PayoutsDateRange onChange={handleDatesChange}></PayoutsDateRange>
        </PageDetails>
      </TopBanner>
      <Main>
      </Main>
    </>
  );
};

export default InvoicePayoutsList;

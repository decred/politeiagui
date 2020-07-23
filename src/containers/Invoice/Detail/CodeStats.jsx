import React from "react";
import { H4 } from "pi-ui";

// import { useCodeStats } from "./hooks";

// TODO: code when the codestats endpoint is fixed
// TODO: add userid prop
const CodeStats = () => {
  // const { loading, error, codestats } = useCodeStats(userid);
  // const shouldPrintTable = !loading && !error && codestats;
  // const shouldPrintEmptyMessage = !loading && !error && !codestats;
  // const shouldPrintErrorMessage = !loading && !error && !codestats;
  return (
    <>
      <H4 className="margin-top-m">Past 3 months code stats</H4>
      {/* {shouldPrintTable ? (
        <Table headers={headers} data={codestats.map(printInvoiceInfo)} />
      ) : shouldPrintEmptyMessage ? (
        <Text>No invoices for this period</Text>
      ) : (
        <Spinner />
      )} */}
    </>
  );
};

export default CodeStats;

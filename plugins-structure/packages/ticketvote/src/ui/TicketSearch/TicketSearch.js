import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "pi-ui";
import { RecordForm } from "@politeiagui/common-ui";
import styles from "./styles.module.css";
import { ticketvoteResults } from "../../ticketvote/results";

export function TicketSearch({ placeholder, token }) {
  const dispatch = useDispatch();

  const [resultsFound, setResultsFound] = useState();

  const results = useSelector((state) =>
    ticketvoteResults.selectByToken(state, token)
  );

  const resultsStatus = useSelector(ticketvoteResults.selectStatus);
  const error = useSelector(ticketvoteResults.selectError);

  function handleSearchTicket({ ticketToken }) {
    const tickets = results
      .filter((r) => r.ticket === ticketToken)
      .map((ticket) => ({
        Ticket: ticket.ticket,
        Option: ticket.votebit === "2" ? "Yes" : "No",
      }));
    setResultsFound(tickets);
  }

  useEffect(() => {
    dispatch(ticketvoteResults.fetch({ token }));
  }, [dispatch, token]);

  const isLoading = resultsStatus === "loading";

  return (
    <div>
      {isLoading && (
        <div
          className={styles.loading}
          data-testid="ticketvote-modal-ticket-search-loading"
        />
      )}
      <RecordForm onSubmit={handleSearchTicket} className={styles.searchForm}>
        {({ TextInput, ErrorMessage }) => (
          <>
            {error && <ErrorMessage error={error} />}
            <TextInput
              name="ticketToken"
              placeholder={isLoading ? "Loading..." : placeholder}
              disabled={isLoading || error}
              data-testid="ticketvote-modal-ticket-search-input"
            />
          </>
        )}
      </RecordForm>
      {resultsFound && (
        <div data-testid="ticketvote-modal-ticket-search-table">
          <Table headers={["Ticket", "Option"]} data={resultsFound} />
        </div>
      )}
    </div>
  );
}

TicketSearch.propTypes = {
  token: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};

TicketSearch.defaultProps = {
  placeholder: "Search by ticket token",
};

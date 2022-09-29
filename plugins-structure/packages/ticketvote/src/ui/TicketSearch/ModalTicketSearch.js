import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Table } from "pi-ui";
import { RecordForm } from "@politeiagui/common-ui";
import styles from "./styles.module.css";
import { ticketvoteResults } from "../../ticketvote/results";

function TicketSearch({ placeholder, token }) {
  const dispatch = useDispatch();

  const [resultsFound, setResultsFound] = useState();

  const results = useSelector((state) =>
    ticketvoteResults.selectByToken(state, token)
  );

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

  return (
    <div>
      <RecordForm onSubmit={handleSearchTicket} className={styles.searchForm}>
        {({ TextInput }) => (
          <TextInput
            name="ticketToken"
            placeholder={placeholder}
            data-testid="ticketvote-modal-ticket-search-input"
          />
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

export function ModalTicketSearch({
  placeholder,
  onClose,
  title,
  show,
  token,
}) {
  return (
    <Modal show={show} onClose={onClose} title={title}>
      <TicketSearch placeholder={placeholder} token={token} />
    </Modal>
  );
}

ModalTicketSearch.propTypes = {
  token: PropTypes.string.isRequired,
  placeholder: PropTypes.node,
  onClose: PropTypes.func,
  title: PropTypes.node,
  show: PropTypes.bool,
};

ModalTicketSearch.defaultProps = {
  title: "Search Ticket Vote",
  placeholder: "Search by ticket token",
};

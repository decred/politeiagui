import React, { useState, useEffect } from "react";
import { Modal, BoxTextInput, Spinner, Message, Table } from "pi-ui";
import { Formik } from "formik";
import { useSearchVotes } from "./hooks";
import styles from "./ModalSearchVotes.module.css";
import validationSchema from "./validation";

function findTicket(ticketToken, votes) {
  return votes.find((v) => v && v.ticket === ticketToken);
}

const ModalSearchVotes = ({ show, onClose, proposal }) => {
  const [ticketFound, setTicketFound] = useState(null);
  const {
    votes,
    loading,
    error: apiError
  } = useSearchVotes(proposal.censorshiprecord.token, show);
  function updateFoundTicket(ticket) {
    setTicketFound({
      Ticket: ticket.ticket,
      Option: ticket.votebit === "2" ? "Yes" : "No"
    });
  }
  function handleSubmit(values, { resetForm, setSubmitting, setFieldError }) {
    const foundTicket = findTicket(values.search, votes);
    setTicketFound(null);
    if (!foundTicket) {
      setFieldError("global", "Ticket not found");
      setSubmitting(false);
      return;
    }
    resetForm();
    updateFoundTicket(foundTicket);
  }
  useEffect(
    function clearState() {
      setTicketFound(null);
    },
    [show]
  );

  const resultsTableHeaders = ["Ticket", "Option"];
  return (
    <Modal
      show={show}
      onClose={onClose}
      title={`Search votes - ${proposal.name}`}
      className={styles.searchVotesModal}>
      <Formik
        initialValues={{
          search: ""
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}>
        {(props) => {
          const {
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            touched,
            errors
          } = props;
          const globalError = (errors && errors.global) || apiError;
          return (
            <div className={styles.contentWrapper}>
              {globalError && (
                <Message kind="error">{globalError.toString()}</Message>
              )}
              {loading ? (
                <div className={styles.loadingWrapper}>
                  <Spinner invert />
                  <span>Fetching proposal votes...</span>
                </div>
              ) : (
                <BoxTextInput
                  searchInput={true}
                  name="search"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.search}
                  placeholder="Search vote by Ticket Token"
                  onSubmit={handleSubmit}
                  error={touched.search && errors.search}
                />
              )}
            </div>
          );
        }}
      </Formik>
      {ticketFound && (
        <>
          <Table
            data={[ticketFound]}
            headers={resultsTableHeaders}
            disablePagination
          />
        </>
      )}
    </Modal>
  );
};

export default ModalSearchVotes;

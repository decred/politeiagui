import React from "react";
import PropTypes from "prop-types";
import { Modal } from "pi-ui";
import { TicketSearch } from "./TicketSearch";

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
  placeholder: PropTypes.string,
  onClose: PropTypes.func,
  title: PropTypes.node,
  show: PropTypes.bool,
};

ModalTicketSearch.defaultProps = {
  title: "Search Ticket Vote",
};

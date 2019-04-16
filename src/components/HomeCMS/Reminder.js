import React from "react";
import PropTypes from "prop-types";
import { Link } from "../snew";

const getIcon = done => (done ? "✔" : "ℹ︎");

export const ReminderList = ({ children, title }) => (
  <>
    <h2 className="reminders-title">{title}</h2>
    <ul className="reminder-list">{children}</ul>
  </>
);

const Reminder = ({
  text,
  doneText,
  done,
  actionText,
  actionLink,
  isAdmin
}) => (
  <li className="reminder-item">
    <span className={`reminder-item_icon ${done ? "done" : ""}`}>
      {getIcon(done)}
    </span>
    <span className="reminder-item_text">{`${isAdmin ? "[admin] " : ""}${
      done && doneText ? doneText : text
    }`}</span>
    {!!actionText && !!actionLink && !done && (
      <Link href={actionLink}>{actionText}</Link>
    )}
  </li>
);

Reminder.propTypes = {
  text: PropTypes.string.isRequired,
  doneText: PropTypes.string,
  done: PropTypes.bool,
  actionText: PropTypes.string,
  actionLink: PropTypes.string,
  isAdmin: PropTypes.bool
};

export default Reminder;

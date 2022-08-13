import React from "react";
import { H3, Link } from "pi-ui";
import styles from "./styles.module.css";

const Rules = () => (
  <div data-testid="proposal-form-rules">
    <H3>Rules:</H3>
    <ul className={styles.rules}>
      <li>Expenses must be denominated in USD (but will be paid in DCR)</li>
      <li>
        The work will be paid next month after the month it was done, as
        explained{" "}
        <Link
          href="https://docs.decred.org/contributing/contributor-compensation/"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </Link>
      </li>
      <li>Proposal must include actionable plan</li>
      <li>
        Check{" "}
        <Link
          href="https://docs.decred.org/governance/politeia/proposal-guidelines/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Proposal Guidelines
        </Link>
      </li>
    </ul>
  </div>
);

export default Rules;

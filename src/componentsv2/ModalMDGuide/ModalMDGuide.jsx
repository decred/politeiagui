import React from "react";
import { Modal, P, Table } from "pi-ui";
import styles from "./ModalMDGuide.module.css";

const MDGuideTable = () => {
  const buildRow = (label, content) => ({
    "You type": label,
    "You see": content
  });
  const tableContent = [
    buildRow("*italics*", <i>italics</i>),
    buildRow("**bold**", <b>bold</b>),
    buildRow("~~strikethrough~~", <s>strikethrough</s>),
    buildRow(
      "[decred!](https://decred.org)",
      <a href="https://decred.org">decred!</a>
    ),
    buildRow(
      <div>
        *item1 <br /> *item2 <br /> *item3{" "}
      </div>,
      <ul>
        <li>item1</li>
        <li>item2</li>
        <li>item3</li>
      </ul>
    ),
    buildRow(
      "> quoted text",
      <div className={styles.blockWrapper}>
        <blockquote className={styles.quotedText}>quoted text</blockquote>
      </div>
    ),
    buildRow(
      <div>
        Lines starting with four spaces <br />
        are treated like code: <br /> <br />
        <span className="spaces">    </span>if 1 * 3 != 3: <br />
        <span className="spaces">        </span>return false
      </div>,
      <div className={styles.blockWrapper}>
        <pre className={styles.codeBlock}>
          if 1 * 2 != 3:
          <br />
          return false
        </pre>
      </div>
    )
  ];
  return (
    <>
      <P>
        We use a slightly customized version from of Markdown for formatting.
        See below for some basics.
      </P>
      <Table
        data={tableContent}
        wrapperClassName={styles.table}
        bodyCellClassName={styles.tableBodyCell}
        headers={["You type", "You see"]}
      />
    </>
  );
};

const ModalMDGuide = ({ title = "Formatting Help", onClose, ...props }) => {
  return (
    <Modal
      title={title}
      onClose={onClose}
      {...props}
      contentStyle={{ width: "100%" }}
      titleStyle={{ paddingRight: "4rem" }}
    >
      <MDGuideTable />
    </Modal>
  );
};

export default ModalMDGuide;

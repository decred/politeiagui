import React from "react";
import {
  Modal,
  P,
  Table,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Link,
  useTheme,
  classNames,
  DEFAULT_DARK_THEME_NAME
} from "pi-ui";
import styles from "./ModalMDGuide.module.css";

const MDGuideTable = () => {
  const { themeName } = useTheme();
  const isDarkTheme = themeName === DEFAULT_DARK_THEME_NAME;
  const buildRow = (label, content) => ({
    "You type": label,
    "You see": content
  });
  const tableContent = [
    buildRow("# header1", <H1>header1</H1>),
    buildRow("## header2", <H2>header2</H2>),
    buildRow("### header3", <H3>header3</H3>),
    buildRow("#### header4", <H4>header4</H4>),
    buildRow("##### header5", <H5>header5</H5>),
    buildRow("###### header6", <H6>header6</H6>),
    buildRow("*italics*", <i>italics</i>),
    buildRow("**bold**", <b>bold</b>),
    buildRow("~~strikethrough~~", <s>strikethrough</s>),
    buildRow(
      "[decred!](https://decred.org)",
      <Link href="https://decred.org">decred!</Link>
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
        <pre
          className={classNames(
            styles.codeBlock,
            isDarkTheme && styles.darkCodeBlock
          )}
        >
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
        bodyCellClassName={classNames(
          styles.tableBodyCell,
          "markdown-body",
          isDarkTheme && styles.dark
        )}
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

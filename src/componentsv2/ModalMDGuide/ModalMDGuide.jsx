import React from "react";
import { Modal, P } from "pi-ui";
import styles from "./ModalMDGuide.module.css";

const ModalMDGuide = ({ title = "Formatting Help", onClose, ...props }) => {
  return (
    <Modal
      title={title}
      onClose={onClose}
      {...props}
      contentStyle={{ width: "100%" }}
      titleStyle={{ paddingRight: "4rem" }}
    >
      <MDGuide />
    </Modal>
  );
};

const MDGuide = () => (
  <div>
    <P>We use a slightly customized version from of Markdown for formatting. See below for some basics.</P>

    <div className={styles.table}>

      <div className={styles.tableHeader}>
        <div><b>You type</b></div>
        <div><b>You see</b></div>
      </div>

      <div className={styles.tableRow}>
        <div>*italics*</div>
        <div><i>italics</i></div>
      </div>

      <div className={styles.tableRow}>
        <div>**bold**</div>
        <div><b>bold</b></div>
      </div>

      <div className={styles.tableRow}>
        <div>~~strikethrough~~</div>
        <div><s>strikethrough</s></div>
      </div>

      <div className={styles.tableRow}>
        <div>[decred!](https://decred.org)</div>
        <div style={{ paddingRight: "40px"}}>
          <a href="https://decred.org">decred!</a>
        </div>
      </div>

      <div className={styles.tableRow}>
        <div>*item1 <br/> *item2 <br/> *item3 </div>
        <div>
          <ul>
            <li>item1</li>
            <li>item2</li>
            <li>item3</li>
          </ul>
        </div>
      </div>

      <div className={styles.tableRow}>
        <div>> quoted text</div>
        <div>
          <blockquote className={styles.quotedText}>quoted text</blockquote>
        </div>
      </div>

      <div className={styles.tableRow}>
        <div>
          Lines starting with four spaces <br/>are treated like code: <br /> <br />
          <span className="spaces">    </span>if 1 * 3 != 3: <br />
          <span className="spaces">        </span>return false
        </div>
        <div style={{ paddingRight: "30px"}}>
          <pre className={styles.codeBlock}>
          if 1 * 2 != 3:
          <br />
            return false
          </pre>
        </div>
      </div>
    </div>
  </div> 
);

export default ModalMDGuide;

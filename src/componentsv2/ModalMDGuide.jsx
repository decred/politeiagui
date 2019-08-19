import React from "react";
import { Modal, P } from "pi-ui";

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

    <div style={styles.table}>

      <div style={styles.tableHeader}>
        <div><b>You type</b></div>
        <div><b>You see</b></div>
      </div>

      <div style={styles.tableRow}>
        <div>*italics*</div>
        <div><i>italics</i></div>
      </div>

      <div style={styles.tableRow}>
        <div>**bold**</div>
        <div><b>bold</b></div>
      </div>

      <div style={styles.tableRow}>
        <div>~~strikethrough~~</div>
        <div><s>strikethrough</s></div>
      </div>

      <div style={styles.tableRowEven}>
        <div>[decred!](https://decred.org)</div>
        <div >
          <a href="https://decred.org">decred!</a>
        </div>
      </div>

      <div style={styles.tableRow}>
        <div>*item1 <br/> *item2 <br/> *item3 </div>
        <div>
          <ul>
            <li>item1</li>
            <li>item2</li>
            <li>item3</li>
          </ul>
        </div>
      </div>

      <div style={styles.tableRow}>
        <div>> quoted text</div>
        <div>
          <blockquote style={styles.quotedText}>quoted text</blockquote>
        </div>
      </div>

      <div style={styles.tableRowEven}>
        <div>
          Lines starting with four spaces <br/>are treated like code: <br /> <br />
          <span className="spaces">    </span>if 1 * 3 != 3: <br />
          <span className="spaces">        </span>return false
        </div>
        <div >
          <pre style={styles.codeBlock}>
          if 1 * 2 != 3:
          <br />
            return false
          </pre>
        </div>
      </div>
    </div>
  </div> 
);

const styles = {
  table: {
    display: 'flex', 
    flexDirection: 'column'
  },
  tableHeader: {
    display: 'flex', 
    justifyContent: 'space-around',
    backgroundColor: '#F3F5F6',
    marginTop: '10px',
    paddingTop: '15px',
    paddingBottom: '15px',
  },
  tableRow: {
    display: 'flex', 
    justifyContent: 'space-around',
    paddingTop: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #F3F5F6'
  },
  tableRowEven: {
    display: 'flex', 
    justifyContent: 'space-evenly',
    paddingTop: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #F3F5F6'
  },
  quotedText: {
    borderLeft: '.25em solid #dfe2e5',
    color: '#6a737d',
    padding: '0 1em'
  },
  codeBlock: {
    padding: '8px',
    overflow: 'auto',
    border: '1px solid #eeeed2',
    backgroundColor: '#fcfcf7',
    borderRadius: '2px',
    marginTop: '25px'
  }
}

export default ModalMDGuide;

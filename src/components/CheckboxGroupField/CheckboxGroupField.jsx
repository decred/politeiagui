import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { Dropdown, DropdownItem, useMediaQuery } from "pi-ui";
import CheckboxField from "../CheckboxField";
import styles from "./CheckboxGroupField.module.css";

const CheckboxGroupField = ({ groupName, options }) => {
  const mobile = useMediaQuery("(max-width: 760px)");

  const fields = useMemo(() => {
    const getCheckBoxName = (name) => `${groupName}.${name}`;
    return options.map((op, idx) => (
      <CheckboxField
        key={`check-${idx}`}
        name={getCheckBoxName(op.name)}
        label={op.label}
      />
    ));
  }, [options, groupName]);

  const renderList = useCallback((elements) => {
    return (
      <ul className={styles.groupList}>
        {elements.map((el, idx) => (
          <li key={`list-item-${idx}`} className={styles.groupListItem}>
            {el}
          </li>
        ))}
      </ul>
    );
  }, []);

  const renderDropdown = useCallback((elements) => {
    return (
      <Dropdown
        closeOnItemClick={false}
        title="Filter by status"
        className={styles.groupDropdown}
      >
        {elements.map((el, idx) => (
          <DropdownItem
            key={`checkbox-${idx}`}
            className={styles.groupDropdownItem}
          >
            {el}
          </DropdownItem>
        ))}
      </Dropdown>
    );
  }, []);

  return mobile ? renderDropdown(fields) : renderList(fields);
};

CheckboxGroupField.propTypes = {
  groupName: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default CheckboxGroupField;

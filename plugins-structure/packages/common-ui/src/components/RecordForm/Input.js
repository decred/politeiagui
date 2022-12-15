import React from "react";
import { Controller } from "react-hook-form";
import {
  BoxTextInput,
  Checkbox as CheckboxUI,
  Select,
  classNames,
  useTheme,
} from "pi-ui";
import styles from "./styles.module.css";
import { MarkdownEditor } from "../Markdown";
import { DigitsField } from "../DigitsField";

export function TextInput({ name = "name", placeholder, ...props }) {
  return (
    <Controller
      name={name}
      render={({ field: { onChange, value } }) => (
        <BoxTextInput
          onChange={onChange}
          value={value || ""}
          placeholder={placeholder}
          inputClassName={styles.input}
          {...props}
        />
      )}
    />
  );
}

export function CurrencyInput({ name = "amount", placeholder, ...props }) {
  return (
    <Controller
      name={name}
      render={({ field: { onChange, value } }) => (
        <div className={styles.currency}>
          <span className={styles.currencyValue}>$</span>
          <BoxTextInput
            type="number"
            inputClassName={classNames(styles.numberInput)}
            placeholder={placeholder}
            onChange={onChange}
            value={value}
            {...props}
          />
        </div>
      )}
    />
  );
}

export function SelectInput({ name = "select", options, ...props }) {
  const { theme } = useTheme();
  return (
    <Controller
      name={name}
      render={({ field: { onChange, value } }) => (
        <Select
          options={options}
          value={value}
          onChange={onChange}
          className={styles.select}
          customStyles={{
            control: (_, { isFocused }) => ({
              borderColor: isFocused
                ? theme["color-primary"]
                : theme["input-border-color"],
            }),
            placeholder: () => ({
              color: theme["text-input-color"],
            }),
          }}
          {...props}
        />
      )}
    />
  );
}

export function MarkdownInput({ name, initialValue, ...props }) {
  return (
    <Controller
      name={name}
      render={({ field: { onChange } }) => (
        <MarkdownEditor
          wrapperClassName={styles.markdownInput}
          onChange={onChange}
          initialValue={initialValue}
          {...props}
        />
      )}
    />
  );
}

export function Checkbox({ name, description, label, ...props }) {
  return (
    <Controller
      name={name}
      render={({ field: { onChange, value } }) => (
        <div>
          <CheckboxUI
            description={description}
            label={label}
            onChange={onChange}
            checked={!!value}
            {...props}
          />
        </div>
      )}
    />
  );
}

export function DigitsInput({ name, ...props }) {
  return (
    <Controller
      name={name}
      render={({ field: { onChange, value } }) => (
        <DigitsField code={value} onChange={onChange} {...props} />
      )}
    />
  );
}

import React from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import {
  BoxTextInput,
  Button,
  Card,
  Message,
  Select,
  classNames,
  useTheme,
} from "pi-ui";
import styles from "./styles.module.css";
import { MarkdownEditor } from "../Markdown";
import { DatePickerInput } from "./DatePickerInput";

function TextInput({ name = "name", placeholder, ...props }) {
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

function CurrencyInput({ name = "amount", placeholder, ...props }) {
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

function SelectInput({ name = "select", options, ...props }) {
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

function MarkdownInput({ name, initialValue, ...props }) {
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

function SubmitButton({ children = "Submit", ...props }) {
  return (
    <Button type="submit" className={styles.button} {...props}>
      {children}
    </Button>
  );
}

function SaveButton({
  children = "Save",
  onSave = () => {},
  className,
  ...props
}) {
  const { getValues } = useFormContext();
  function handleSave() {
    onSave(getValues());
  }
  return (
    <Button
      kind="secondary"
      onClick={handleSave}
      className={classNames(styles.button, className)}
      {...props}
    >
      {children}
    </Button>
  );
}

function Warning({ children }) {
  return (
    <Message kind="warning" className={styles.message}>
      {children}
    </Message>
  );
}

function ErrorMessage({ error }) {
  return (
    error && (
      <Message
        kind="error"
        data-testid="record-form-error-message"
        className={styles.message}
      >
        {error.toString()}
      </Message>
    )
  );
}

export function RecordForm({ initialValues, children, onSubmit, className }) {
  const formProps = useForm({ defaultValues: initialValues });
  return (
    <Card paddingSize="small" className={className}>
      <FormProvider {...formProps}>
        <form
          onSubmit={formProps.handleSubmit(onSubmit)}
          className={styles.form}
          data-testid="record-form"
        >
          {children({
            formProps,
            CurrencyInput,
            DatePickerInput,
            ErrorMessage,
            MarkdownInput,
            SaveButton,
            SelectInput,
            SubmitButton,
            TextInput,
            Warning,
          })}
        </form>
      </FormProvider>
    </Card>
  );
}

import React from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { BoxTextInput, Button, Card, Select } from "pi-ui";
import styles from "./styles.module.css";
import { MarkdownEditor } from "../Markdown";

function TextInput({
  name = "name",
  placeholder,
  min,
  max,
  minLength,
  maxLength,
  pattern,
  validate,
  required,
}) {
  return (
    <Controller
      name={name}
      rules={{
        min,
        max,
        minLength,
        maxLength,
        pattern,
        validate,
        required,
      }}
      render={({ field: { onChange, value } }) => (
        <BoxTextInput
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          inputClassName={styles.input}
        />
      )}
    />
  );
}

function SelectInput({ name = "select", options, ...props }) {
  return (
    <Controller
      name={name}
      render={({ field: { onChange, value } }) => (
        <Select
          options={options}
          value={value}
          onChange={onChange}
          className={styles.select}
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

function SaveButton({ children = "Save", onSave = () => {}, ...props }) {
  const { getValues } = useFormContext();
  function handleSave() {
    onSave(getValues());
  }
  return (
    <Button kind="secondary" onClick={handleSave} {...props}>
      {children}
    </Button>
  );
}

export function RecordForm({ initialValues, children, onSubmit }) {
  const methods = useForm({ defaultValues: initialValues });
  return (
    <Card paddingSize="small">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className={styles.form}>
          {children({
            TextInput,
            SelectInput,
            MarkdownInput,
            SubmitButton,
            SaveButton,
          })}
        </form>
      </FormProvider>
    </Card>
  );
}

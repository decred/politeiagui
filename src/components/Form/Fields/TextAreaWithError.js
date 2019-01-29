import React from "react";

class TextAreaWithError extends React.Component {
  render() {
    const {
      input,
      label,
      placeholder,
      tabIndex,
      type,
      style,
      meta: { touched, error, warning }
    } = this.props;
    return (
      <div className="input-with-error">
        <label>{label}</label>
        <textarea
          {...input}
          tabIndex={tabIndex}
          placeholder={placeholder}
          type={type}
          style={style}
        />
        <div className="input-subline">
          {touched &&
            ((error && <div className="input-error">{error}</div>) ||
              (warning && <div className="input-warning">{warning}</div>))}
        </div>
      </div>
    );
  }
}

export default TextAreaWithError;

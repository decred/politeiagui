import { h, Component } from "preact";
import { autobind } from "core-decorators";
import Markdown from "./MarkdownRenderer";

@autobind
class MarkdownEditor extends Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.value || "" };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value != nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  render() {
    const {
      className,
      placeholder = "Markdown Entry",
      rows=20,
      cols=80
    } = this.props;
    const value = this.props.onChange ? this.props.value : this.state.value;

    return (
      <div className={`markdown-editor ${className}`}>
        <div className={"editor"}>
          <textarea {...{
            placeholder,
            value,
            rows,
            cols,
            onInput: this.onChange,
            onChange: this.onChange
          }} />
        </div>
        <div className={"preview"}>
          <Markdown value={value} />
        </div>
      </div>
    );
  }

  onChange({ target: { value }}) {
    const { onChange } = this.props;
    this.setState({ value });
    onChange && onChange(value);
  }
}


export default MarkdownEditor;

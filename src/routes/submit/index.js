import { h, Component } from "preact";
import submitConnector from "../../connectors/proposal";
import SubmitPage from "./Page";
import "../../../node_modules/font-awesome/css/font-awesome.css";
import "../../../node_modules/react-mde/lib/styles/react-mde.scss";
import "../../../node_modules/react-mde/lib/styles/react-mde-command-styles.scss";
import "../../../node_modules/react-mde/lib/styles/markdown-default-theme.scss";

class Submit extends Component {
  constructor(props) {
    super(props);
    this.state = { description: {text: "", selection: null } };
  }

  render() {
    return <SubmitPage {...this.props} {...this.state} onSetDescription={this.onSetDescription.bind(this)} />;
  }

  onSetDescription(description) {
    console.log("onSetDescription", description);
    this.setState({ description });
  }
}

export default submitConnector(Submit);

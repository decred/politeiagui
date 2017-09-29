import { h, Component } from "preact";
import proposalConnector from "../../connectors/proposal";
import ProposalPage from "./Page";

class Proposal extends Component {
  componentDidMount() {
    this.props.onFetchData(this.props.token);
  }

  willReceiveProps(nextProps) {
    if (nextProps.token !== this.props.token) {
      nextProps.onFetchData(nextProps.token);
    }
  }

  render() {
    return <ProposalPage {...this.props} />;
  }
}

export default proposalConnector(Proposal);

import { h, Component } from "preact";
import proposalsConnector from "../../connectors/proposals";
import ProposalsPage from "./Page";

class Proposals extends Component {
  componentDidMount() {
    this.props.onFetchData();
  }

  render() {
    return <ProposalsPage {...this.props} />;
  }
}

export default proposalsConnector(Proposals);

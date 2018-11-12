import React from "react";
import LoadingIcon from "./LoadingIcon";

class PageLoadingIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: this.props.hidden || false
    };
  }
  componentDidMount() {
    if (!this.props.hidden) {
      this.loadingIconDelay = setTimeout(() => {
        this.setState({ show: true });
        this.loadingIconDelay = 0;
      }, 1000);
    }
  }
  componentWillUnmount() {
    if (this.loadingIconDelay) {
      clearTimeout(this.loadingIconDelay);
      this.loadingIconDelay = 0;
    }
  }
  render() {
    const { show } = this.state;
    return (
      <LoadingIcon
        hidden={!show}
        width={200}
        style={{ paddingTop: "300px", margin: "0 auto" }}
      />
    );
  }
}
export default PageLoadingIcon;

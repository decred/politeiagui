import { h, Component } from "preact";
import { Router } from "preact-router";
import { Provider } from "preact-redux";
import configureStore from "../configureStore";
import Header from "./Header";
import Home from "../routes/home";
import Proposals from "../routes/proposals";
import Proposal from "../routes/proposal";
import Submit from "../routes/submit";
// import Home from 'async!./home';
// import Proposals from 'async!./proposals';
// import Proposal from 'async!./proposal';
// import Submit from 'async!./submit';

const store = configureStore();

export default class App extends Component {
  /** Gets fired when the route changes.
   *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
   *	@param {string} event.url	The newly routed URL
   */
  handleRoute = e => {
    this.currentUrl = e.url;
  };

  render() {
    return (
      <Provider store={store}>
        <div id='app'>
          <Header />
          <Router onChange={this.handleRoute}>
            <Home path='/' />
            <Proposals path='/proposals/' />
            <Proposal path='/proposals/:token' />
            <Submit path='/submit' />
          </Router>
        </div>
      </Provider>
    );
  }
}

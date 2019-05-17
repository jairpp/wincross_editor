import React from "react";
import { connect } from "react-redux";

import Project from "./components/Project/Project";

class App extends React.Component {
  render() {
    return (
      <div id="app" className="container">
        <Project />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  questions: state.questions
});

export default connect(mapStateToProps)(App);

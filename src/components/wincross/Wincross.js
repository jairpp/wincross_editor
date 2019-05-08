import React from "react";
import * as WC from "../../lib/wincrossLib";
import { connect } from "react-redux";

class Wincross extends React.Component {
  render() {
    // console.log("WC Render");
    let wcChecks = WC.initializeTest(this.props);
    let check = wcChecks.test;
    let reverseCheck = wcChecks.reverseTest;

    return (
      <div className="wincross-wrapper">
        Wincross Check {this.props.qNumber}
        <div className="wcSystemCheck">{check}</div>
        <div className="wcSystemCheck reverse">{reverseCheck}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  choices: state.choices,
  project: state.project
});

export default connect(mapStateToProps)(Wincross);

import React from "react";
import Question from "../questions/Question";
import { connect } from "react-redux";

import * as actions from "../../store/actions";

class Project extends React.Component {
  state = {
    systemBaseType: "PREVIOUS"
  };

  toggleBaseType = () => {
    if (this.state.systemBaseType === "PREVIOUS") {
      this.props.dispatch(actions.toggle_system_base("TERM"));
      this.setState({
        systemBaseType: "TERM"
      });
    } else {
      this.props.dispatch(actions.toggle_system_base("PREVIOUS"));
      this.setState({
        systemBaseType: "PREVIOUS"
      });
    }
  };

  componentDidMount() {}

  render() {
    const questions = this.props.questions.map((q, index) => {
      return <Question qText={q.qText} qNumber={q.qNumber} key={q.qNumber} />;
    });
    return (
      <div className="project-wrapper">
        <button onClick={this.toggleBaseType}>
          {this.state.systemBaseType}
        </button>
        {questions}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  questions: state.questions,
  project: state.project,
  choices: state.choices
});

export default connect(mapStateToProps)(Project);

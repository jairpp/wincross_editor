import React from "react";
import Question from "./components/questions/Question";
import { connect } from "react-redux";

class App extends React.Component {
  render() {
    const questions = this.props.questions.map((el, ind) => {
      return (
        <Question qText={el.qText} qNumber={el.qNumber} key={el.qNumber} />
      );
    });

    return (
      <div id="app" className="container">
        {questions}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  questions: state.questions
});

export default connect(mapStateToProps)(App);

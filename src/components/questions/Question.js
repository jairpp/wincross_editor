import React from "react";
import { connect } from "react-redux";
import Choices from "../choices/choices";
import Wincross from "../wincross/Wincross";

import "../../css/main.css";

class Question extends React.Component {
  render() {
    // console.log("Questions Render");
    const choices = this.props.choices.map((choice, ind) => {
      let allChoices = choice.map((indChoice, ind) => {
        if (this.props.qNumber === indChoice.qNumber) {
          return <Choices data={indChoice} key={ind.toString()} />;
        }
      });
      return allChoices;
    });

    return (
      <div className="question-wrapper row">
        <div className="col-sm-6 question-container">
          <p>{this.props.qText}</p>
          <div className="choice-wrapper">{choices}</div>
        </div>
        <div className="col-sm-6 check-container">
          <Wincross
            choices={this.props.choices}
            questions={this.props.questions}
            qNumber={this.props.qNumber}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  choices: state.choices,
  questions: state.questions
});

export default connect(mapStateToProps)(Question);

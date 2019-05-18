import React from "react";
import * as actions from "../../store/actions";
import { connect } from "react-redux";

class Choices extends React.Component {
  handleClick = () => {
    this.props.dispatch(actions.toggle_term_point(this.props.data));
  };

  render() {
    return (
      <div className="choice-container">
        <label>
          <input
            type="checkbox"
            onClick={this.handleClick}
            checked={this.props.isTermPoint}
          />
          {this.props.data.cText}
        </label>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  questions: state.questions,
  project: state.project,
  choices: state.choices
});

export default connect(mapStateToProps)(Choices);

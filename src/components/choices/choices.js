import React from "react";
import * as actions from "../../store/actions";
import { connect } from "react-redux";

class Choices extends React.Component {
  handleClick = () => {
    this.props.dispatch(actions.toggle_term_point(this.props.data));
  };

  render() {
    console.log("Choices Render: ", this.props.data);
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

export default connect()(Choices);

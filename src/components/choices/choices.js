import React from "react";
import * as actions from "../../store/actions";
import { connect } from "react-redux";

class Choices extends React.Component {
  handleClick = () => {
    // console.log("before: ", this.props);

    this.props.dispatch(actions.toggle_term_point(this.props.data));

    // console.log("after: ", this.props);
  };

  render() {
    // console.log("Choices Render: ", this.props.data);
    return (
      <div className="choice-container">
        <label>
          <input type="checkbox" onClick={this.handleClick} />
          {this.props.data.cText}
        </label>
      </div>
    );
  }
}

export default connect()(Choices);

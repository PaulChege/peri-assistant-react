import React from "react";
import LessonForm from "./LessonForm";
import { connect } from "react-redux";

class LessonCreate extends React.Component {
  onSubmit = () => {};
  render() {
    return (
      <LessonForm
        title="Add Lesson"
        onSubmit={this.onSubmit}
        errors={this.props.errors}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    erros: {}
  };
};

export default connect(mapStateToProps)(LessonCreate);

import React from "react";
import LessonForm from "./LessonForm";
import { connect } from "react-redux";
import { createLesson } from "../../actions/lessons";

class LessonCreate extends React.Component {
  onSubmit = formValues => {
    this.props.createLesson(this.props.match.params.id, formValues);
  };
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
    errors: state.errors.lessonCreateError
  };
};

export default connect(mapStateToProps, { createLesson })(LessonCreate);

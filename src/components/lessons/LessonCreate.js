import React from "react";
import LessonForm from "./LessonForm";
import { connect } from "react-redux";
import { createLesson } from "../../actions/lessons";
import { getStudent } from "../../actions/students";

class LessonCreate extends React.Component {
  onSubmit = formValues => {
    const { id } = this.props.match.params;
    this.props.getStudent(id);
    this.props.createLesson(id, formValues);
  };
  render() {
    const { student } = this.props;
    return (
      <LessonForm
        title="Add Lesson"
        onSubmit={this.onSubmit}
        errors={this.props.errors}
        initialValues={{ paid: false, time: student.lesson_time }}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    student: state.students[ownProps.match.params.id],
    errors: state.errors.lessonCreateError
  };
};

export default connect(mapStateToProps, { createLesson, getStudent })(
  LessonCreate
);

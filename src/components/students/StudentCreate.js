import React from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { createStudent } from "../../actions/students";

class StudentCreate extends React.Component {
  onSubmit = formValues => {
    this.props.createStudent(formValues);
  };
  renderForm(input, placeholder, type = "") {
    return (
      <div className="form-group">
        <input
          {...input}
          placeholder={placeholder}
          type={type}
          className="form-control"
        />
      </div>
    );
  }
  render() {
    return (
      <div className="col-sm-6">
        <h5>Add Student</h5>
        <br />
        <p className="text-danger">{this.props.errors}</p>
        <br />
        <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <Field
            name="name"
            component={({ input }) => this.renderForm(input, "Name")}
          />
          <Field
            name="email"
            component={({ input }) => this.renderForm(input, "Email", "email")}
          />
          <Field
            name="mobile_number"
            component={({ input }) => this.renderForm(input, "Mobile Number")}
          />
          <Field
            name="institution"
            component={({ input }) => this.renderForm(input, "Institution")}
          />
          <Field
            name="instrument"
            component={({ input }) => this.renderForm(input, "Instrument")}
          />
          <Field
            name="start_date"
            component={({ input }) =>
              this.renderForm(input, "Start Date", "date")
            }
          />
          <label>Usual Lesson Day: </label>
          <Field
            name="lesson_day"
            component={({ input }) => (
              <select className="form-control" {...input}>
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thurday</option>
                <option>Friday</option>
                <option>Saturday</option>
                <option>Sunday</option>
              </select>
            )}
          />
          <br />
          <label>Usual Lesson Time: </label>

          <Field
            name="lesson_time"
            component={({ input }) => this.renderForm(input, "", "time")}
          />
          <Field
            name="goals"
            component={({ input }) => this.renderForm(input, "Goals")}
          />
          <button className="btn btn-primary">Add Student</button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    errors: state.students.createErrors
  };
};
export default connect(mapStateToProps, { createStudent })(
  reduxForm({
    form: "studentCreateForm"
  })(StudentCreate)
);

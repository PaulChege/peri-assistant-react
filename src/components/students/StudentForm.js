import React from "react";
import { Field, reduxForm } from "redux-form";

class StudentForm extends React.Component {
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
      <div className="container">
        <br />
        <br />
        <h5>{this.props.title}</h5>
        <p className="text-danger">{this.props.errors}</p>
        <form onSubmit={this.props.handleSubmit(this.props.onSubmit)}>
          <div className="row">
            <div className="col-sm-6">
              <Field
                name="name"
                component={({ input }) => this.renderForm(input, "Name")}
              />
              <Field
                name="email"
                component={({ input }) =>
                  this.renderForm(input, "Email", "email")
                }
              />
              <Field
                name="mobile_number"
                component={({ input }) =>
                  this.renderForm(input, "Mobile Number")
                }
              />
              <Field
                name="institution"
                component={({ input }) => this.renderForm(input, "Institution")}
              />
              <label>Instrument:</label>
              <Field
                name="instrument"
                component={({ input }) => {
                  return (
                    <div className="form-group">
                      <select {...input} className="form-control">
                        <option></option>
                        {this.props.instrumentList.map((instrument, index) => (
                          <option key={index} value={instrument}>
                            {instrument}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }}
              />
              <label>Start Date: </label>
              <Field
                name="start_date"
                component={({ input }) => this.renderForm(input, "", "date")}
              />
              <label>Date of Birth: </label>
              <Field
                name="date_of_birth"
                component={({ input }) => this.renderForm(input, "", "date")}
              />
              <Field
                name="goals"
                component={({ input }) => this.renderForm(input, "Goals")}
              />
            </div>
            <div className="col-sm-6">
              <label>Usual Lesson Day: </label>
              <Field
                name="lesson_day"
                component={({ input }) => {
                  return (
                    <div className="form-group">
                      <select className="form-control" {...input}>
                        <option></option>
                        <option value="0">Monday</option>
                        <option value="1">Tuesday</option>
                        <option value="2">Wednesday</option>
                        <option value="3">Thurday</option>
                        <option value="4">Friday</option>
                        <option value="5">Saturday</option>
                        <option value="6">Sunday</option>
                      </select>
                    </div>
                  );
                }}
              />
              <label>Usual Lesson Time: </label>
              <Field
                name="lesson_time"
                component={({ input }) => this.renderForm(input, "", "time")}
              />

              <label>Usual Lesson Duration: </label>
              <Field
                name="lesson_duration"
                component={({ input }) => this.renderForm(input, "", "number")}
              />

              <label>Usual Lesson Charge: </label>
              <Field
                name="lesson_charge"
                component={({ input }) => this.renderForm(input, "", "number")}
              />
            </div>
          </div>
          <br />
          <button className="btn btn-primary">Save</button>
        </form>
      </div>
    );
  }
}

export default reduxForm({ form: "studentForm" })(StudentForm);

import React from "react";
import { Form, Field } from "react-final-form";
import LoadingIndicator from "../LoadingIndicator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

class LessonForm extends React.Component {
  renderForm(input, placeholder, type = "") {
    return (
      <div className="form-group mb-3">
        <input
          {...input}
          placeholder={placeholder}
          type={type}
          className="form-control"
          style={{ maxWidth: 350 }}
        />
      </div>
    );
  }
  handleFormSubmit = (values) => {
    // Merge day and time into a single UTC date_time string
    const { day, time, ...rest } = values;
    let date_time;
    if (day && time) {
      // Combine and convert to UTC ISO string
      const local = new Date(`${day}T${time}`);
      date_time = new Date(local.getTime() - local.getTimezoneOffset() * 60000).toISOString();
    }
    const submitValues = { ...rest, date_time };
    if (this.props.onSubmit) {
      this.props.onSubmit(submitValues);
    }
  };
  render() {
    return (
      <div className="container">
        <br />
        <br />
        <h5>{this.props.title}</h5>
        <p className="text-danger">{this.props.errors}</p>
        <Form
          onSubmit={this.handleFormSubmit}
          initialValues={this.props.initialValues}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <label className="mb-1">Day</label>
                  <Field
                    name="day"
                    render={({ input }) => this.renderForm(input, "", "date")}
                  />
                  <label className="mb-1">Time</label>
                  <Field
                    name="time"
                    render={({ input }) => this.renderForm(input, "", "time")}
                  />
                  <label className="mb-1">Duration (Minutes)</label>
                  <Field
                    name="duration"
                    render={({ input }) => this.renderForm(input, "", "number")}
                  />
                  <label className="mb-1">Status</label>
                  <Field
                    name="status"
                    render={({ input }) => {
                      return (
                        <div className="form-group mb-3" style={{ position: 'relative', maxWidth: 350 }}>
                          <select
                            {...input}
                            className="form-control"
                            style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', paddingRight: 30, width: '100%', maxWidth: 350 }}
                          >
                            <option></option>
                            <option value="attended">Attended</option>
                            <option value="missed">Missed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <FontAwesomeIcon icon={faChevronDown} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#888' }} />
                        </div>
                      );
                    }}
                  />
                  <label className="mb-1">Paid</label>
                  <Field
                    name="paid"
                    render={({ input }) => {
                      return (
                        <div className="form-group mb-3" style={{ position: 'relative', maxWidth: 350 }}>
                          <select
                            className="form-control"
                            value={input.value ? 'yes' : 'no'}
                            onChange={e => input.onChange(e.target.value === 'yes')}
                            style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', paddingRight: 30, width: '100%', maxWidth: 350 }}
                          >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                          </select>
                          <FontAwesomeIcon icon={faChevronDown} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#888' }} />
                        </div>
                      );
                    }}
                  />
                  <label className="mb-1">Charge{this.props.currency ? ` (${this.props.currency})` : ''}</label>
                  <Field
                    name="charge"
                    render={({ input }) => this.renderForm(input, "", "number")}
                  />
                </div>
                <div className="col-md-6">
                  <label className="mb-1">Plan</label>
                  <Field
                    name="plan"
                    render={({ input }) => {
                      return (
                        <div className="form-group mb-3">
                          <textarea
                            {...input}
                            placeholder="Your lesson plan is..."
                            className="form-control"
                            style={{ minHeight: 100 }}
                          />
                        </div>
                      );
                    }}
                  />
                  <label className="mb-1">Post lesson notes</label>
                  <Field
                    name="notes"
                    render={({ input }) => {
                      return (
                        <div className="form-group mb-3">
                          <textarea
                            {...input}
                            placeholder="Add post lesson notes..."
                            className="form-control"
                            style={{ minHeight: 80 }}
                          />
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
              <br />
              <LoadingIndicator />
              <button className="btn btn-primary">Save</button>
            </form>
          )}
        />
      </div>
    );
  }
}
export default LessonForm;

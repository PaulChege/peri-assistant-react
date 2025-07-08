import React, { useState, useRef } from "react";
import { Field, Form } from "react-final-form";
import LoadingIndicator from "../LoadingIndicator";
import periAssistantApi from "../../api/periAssistantApi";

function InstitutionAutocomplete({ input, disabled, ...rest }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef();

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const response = await periAssistantApi.get(`/institutions/search?q=${encodeURIComponent(query)}`);
      setSuggestions(Array.isArray(response.data) ? response.data : (response.data.results || []));
    } catch (e) {
      setSuggestions([]);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    input.onChange(value);
    setShowDropdown(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSelect = (suggestion) => {
    input.onChange(suggestion);
    setShowDropdown(false);
    setSuggestions([]);
  };

  return (
    <div className="form-group" style={{ position: "relative" }}>
      <input
        {...input}
        {...rest}
        value={input.value}
        onChange={handleChange}
        placeholder="Institution"
        className="form-control"
        autoComplete="off"
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
        onFocus={() => input.value && setShowDropdown(true)}
        disabled={disabled}
      />
      {loading && <div>Loading...</div>}
      {showDropdown && suggestions.length > 0 && !disabled && (
        <ul className="list-group" style={{ position: "absolute", zIndex: 1000, width: "100%" }}>
          {suggestions.map((suggestion, idx) => (
            <li
              key={idx}
              className="list-group-item list-group-item-action"
              onClick={() => handleSelect(suggestion)}
              style={{ cursor: "pointer" }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

class StudentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      homeLessons: false,
    };
  }

  handleHomeLessonsChange = (e, input) => {
    const checked = e.target.checked;
    this.setState({ homeLessons: checked }, () => {
      if (checked) {
        // Set institution to 'Home' when checked
        input.onChange('Home');
      } else {
        // Clear institution when unchecked
        input.onChange('');
      }
    });
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

  handleSubmit = (values) => {
    // Always send institution as 'Home' if homeLessons is checked
    const submitValues = {
      ...values,
      institution: this.state.homeLessons ? 'Home' : values.institution,
    };
    this.props.onSubmit(submitValues);
  };

  render() {
    return (
      <div className="container">
        <br />
        <br />
        <h5>{this.props.title}</h5>
        <p className="text-danger">{this.props.errors}</p>
        <Form
          onSubmit={this.handleSubmit}
          initialValues={this.props.initialValues}
          render={({ handleSubmit, values }) => (
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-sm-6">
                  <Field
                    name="name"
                    render={({ input }) => this.renderForm(input, "Name")}
                  />
                  <Field
                    name="email"
                    render={({ input }) =>
                      this.renderForm(input, "Email", "email")
                    }
                  />
                  <Field
                    name="mobile_number"
                    render={({ input }) =>
                      this.renderForm(input, "Mobile Number")
                    }
                  />
                  {/* Home Lessons Checkbox */}
                  <Field
                    name="homeLessons"
                    type="checkbox"
                    render={({ input }) => (
                      <div className="form-group form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="homeLessonsCheckbox"
                          checked={this.state.homeLessons}
                          onChange={e => this.handleHomeLessonsChange(e, input)}
                        />
                        <label className="form-check-label" htmlFor="homeLessonsCheckbox">
                          Home Lessons
                        </label>
                      </div>
                    )}
                  />
                  {/* Institution Autocomplete Field (backend) */}
                  <Field
                    name="institution"
                    render={({ input }) => (
                      <InstitutionAutocomplete input={input} disabled={this.state.homeLessons} />
                    )}
                  />
                  <Field
                    name="instrument"
                    render={({ input }) => {
                      return (
                        <div className="form-group">
                          <label>Instrument:</label>
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
                    render={({ input }) => this.renderForm(input, "", "date")}
                  />
                  <label>Date of Birth: </label>
                  <Field
                    name="date_of_birth"
                    render={({ input }) => this.renderForm(input, "", "date")}
                  />
                  <Field
                    name="goals"
                    render={({ input }) => this.renderForm(input, "Goals")}
                  />
                </div>
                <div className="col-sm-6">
                  <label>Usual Lesson Day: </label>
                  <Field
                    name="lesson_day"
                    render={({ input }) => {
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
                    render={({ input }) => this.renderForm(input, "", "time")}
                  />

                  <label>Usual Lesson Duration: </label>
                  <Field
                    name="lesson_duration"
                    render={({ input }) => this.renderForm(input, "", "number")}
                  />

                  <label>Usual Lesson Charge: </label>
                  <Field
                    name="lesson_charge"
                    render={({ input }) => this.renderForm(input, "", "number")}
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

export default StudentForm;

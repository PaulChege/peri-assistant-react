import React, { useEffect, useCallback, useState } from "react";
import { Field, Form } from "react-final-form";
import { connect, useSelector } from "react-redux";
import { updateUser, getUser, clearUserEditSuccess } from "../../actions/users";
import UserDeleteModal from "../users/UserDeleteModal";
import { trackPromise } from "react-promise-tracker";
import LoadingIndicator from "../LoadingIndicator";
import { useNavigate } from "react-router-dom";
import { countryList } from './countryList';
import { currencyList } from './currencyList';
import Select from 'react-select';

function UserEdit({ updateUser, getUser, clearUserEditSuccess, initialValues, errors }) {
  const navigate = useNavigate();
  const userUpdated = useSelector(state => state.user.userUpdated);
  const [country, setCountry] = useState(initialValues ? initialValues.country : '');
  const [currency, setCurrency] = useState(initialValues ? initialValues.currency : '');

  useEffect(() => {
    getUser();
    clearUserEditSuccess(); // Clear flag on mount
    return () => clearUserEditSuccess(); // Clear flag on unmount
  }, [getUser, clearUserEditSuccess]);

  useEffect(() => {
    if (userUpdated) {
      navigate("/");
    }
  }, [userUpdated, navigate]);

  useEffect(() => {
    setCountry(initialValues ? initialValues.country : '');
    setCurrency(initialValues ? initialValues.currency : '');
  }, [initialValues]);

  const onSubmit = useCallback(async (formValues) => {
    const updatedUser = {
      ...formValues,
      country,
      currency,
    };
    await trackPromise(updateUser(updatedUser));
    // Do not navigate here!
  }, [updateUser, country, currency]);

  const renderForm = (input, placeholder, type = "") => (
    <div className="form-group">
      <input
        {...input}
        placeholder={placeholder}
        type={type}
        className="form-control"
      />
    </div>
  );

  const onClose = e => {
    // If you need to handle modal close
  };

  return (
    <div className="col-sm-4 mx-auto">
      <br />
      <h4>Account Details</h4>
      <br />
      <label>Email: </label>
      <p>
        <i>
          {initialValues ? initialValues.email : ""}
        </i>
      </p>
      <p className="text-danger">{errors}</p>
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <label>Name:</label>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <Field
                name="name"
                render={({ input }) => renderForm(input, "Name")}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="country">Country</label>
              <Select
                id="country"
                options={countryList.map(c => ({ value: c.code, label: c.name }))}
                value={countryList.find(c => c.code === country) ? { value: country, label: countryList.find(c => c.code === country).name } : null}
                onChange={option => setCountry(option ? option.value : '')}
                isClearable
                placeholder="Select country..."
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="currency">Currency</label>
              <Select
                id="currency"
                options={currencyList.map(c => ({ value: c.code, label: c.name }))}
                value={currencyList.find(c => c.code === currency) ? { value: currency, label: currencyList.find(c => c.code === currency).name } : null}
                onChange={option => setCurrency(option ? option.value : '')}
                isClearable
                placeholder="Select currency..."
              />
            </div>
            <button className="btn btn-primary">Save</button>
            <LoadingIndicator />
          </form>
        )}
      />
      <br />
      <br />
      <button
        type="button"
        className="btn btn-outline-danger btn-sm"
        data-toggle="modal"
        data-target="#userDeleteModal"
      >
        Delete Account
      </button>
      <UserDeleteModal onClose={onClose} />
    </div>
  );
}

const mapStateToProps = state => {
  return {
    initialValues: state.user.currentUser,
    errors: state.errors.userEditError
  };
};

export default connect(mapStateToProps, { updateUser, getUser, clearUserEditSuccess })(UserEdit);

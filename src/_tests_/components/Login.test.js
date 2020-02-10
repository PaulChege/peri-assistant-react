import React from "react";
import { Provider } from "react-redux";
import renderer from "react-test-renderer";
import configureStore from "redux-mock-store";
import Login from "../../components/Login";
import thunk from "redux-thunk";
const mockStore = configureStore([thunk]);

describe("Login Component", () => {
  let store;
  let component;
  beforeEach(() => {
    store = mockStore({
      errors: {}
    });
    store.dispatch = jest.fn();

    component = renderer.create(
      <Provider store={store}>
        <Login />
      </Provider>
    );
  });
  it("should render form", () => {
    expect(component).toMatchSnapshot();
  });
  it("should submit form with email and password", () => {
    renderer.act(() => {
      component.root.findByType("form").props.onSubmit();
    });
    expect(store.dispatch).toHaveBeenCalledTimes(5);
  });
});

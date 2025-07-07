import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import reducers from "./reducers";
import { thunk } from "redux-thunk";

const composedEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // For redux dev tools
const store = createStore(
  reducers,
  composedEnhancers(applyMiddleware(thunk))
);

const container = document.querySelector("#root");
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

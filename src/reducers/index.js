import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import userReducer from "./userReducer";
import studentReducer from "./studentReducer";

export default combineReducers({
  form: formReducer,
  user: userReducer,
  students: studentReducer
});

import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import userReducer from "./userReducer";
import studentReducer from "./studentReducer";
import { USER_LOGOUT } from "../actions/types";
import instrumentReducer from "./instrumentReducer";
import lessonReducer from "./lessonReducer";
import errorReducer from "./errorReducer";
import flashReducer from "./flashReducer"

const appReducer = combineReducers({
  form: formReducer,
  errors: errorReducer,
  flash: flashReducer,
  user: userReducer,
  students: studentReducer,
  instruments: instrumentReducer,
  lessons: lessonReducer
});

const rootReducer = (state, action) => {
  if (action.type === USER_LOGOUT) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;

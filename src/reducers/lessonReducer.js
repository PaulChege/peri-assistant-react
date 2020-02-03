import {
  STUDENT_LESSONS_LIST,
  STUDENT_LESSONS_CREATE,
  STUDENT_LESSONS_UPDATE,
  STUDENT_LESSONS_SHOW,
  STUDENT_LESSONS_DELETE
} from "../actions/types";

export default (state = [], action) => {
  switch (action.type) {
    case STUDENT_LESSONS_LIST:
      return action.payload;
    case STUDENT_LESSONS_SHOW:
      return [action.payload];
    case STUDENT_LESSONS_CREATE:
      return insertLesson(state, action.payload);
    case STUDENT_LESSONS_UPDATE:
      return updateLesson(state, action.payload);
    case STUDENT_LESSONS_DELETE:
      return removeLesson(state, action.payload);
    default:
      return state;
  }
};

const insertLesson = (state, payload) => {
  state = state.slice();
  state.push(payload);
  return state;
};

const updateLesson = (state, payload) => {
  return state.map(item => {
    if (item.id !== payload.id) {
      return item;
    }
    return {
      ...item,
      ...payload
    };
  });
};

const removeLesson = (state, payload) => {
  return state.filter(item => item.id !== payload.id);
};

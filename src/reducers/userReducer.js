export default (state = {}, action) => {
  switch (action.type) {
    case "USER_CREATE":
      return { ...state, currentUser: action.payload };
    case "USER_CREATE_FAILED":
      return { ...state, errors: action.payload };
    default:
      return state;
  }
};

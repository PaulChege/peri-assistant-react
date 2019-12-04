import periAssistantApi from "../api/periAssistantApi";
import history from "../history";

export const userCreate = formValues => async dispatch => {
  try {
    const response = await periAssistantApi.post("/signup", formValues);
    dispatch({ type: "USER_CREATE", payload: response.data.user });
    history.push("/");
  } catch (err) {
    dispatch({
      type: "USER_CREATE_FAILED",
      payload: err.response.data.message
    });
  }
};

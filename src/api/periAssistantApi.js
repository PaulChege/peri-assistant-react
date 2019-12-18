import axios from "axios";

export default axios.create({
  baseURL: "https://peri-assistant-api.herokuapp.com/"
});

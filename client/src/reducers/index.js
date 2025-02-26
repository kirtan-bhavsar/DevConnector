import { combineReducers } from "redux";
import alert from "../reducers/alertReducer.js";
import auth from "../reducers/authReducer.js";

export default combineReducers({
  alert,
  auth,
});

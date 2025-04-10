import { SET_ALERT, REMOVE_ALERT } from "../actions/types.js";
import { v4 as uuidv4 } from "uuid";

const setAlert =
  (msg, alertType, timeout = 5000) =>
  (dispatch) => {
    const id = uuidv4();

    dispatch({
      type: SET_ALERT,
      payload: {
        id,
        msg,
        alertType,
      },
    });

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
  };

export { setAlert };

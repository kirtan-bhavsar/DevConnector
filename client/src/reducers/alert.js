import { SET_ALERT, REMOVE_ALERT } from "../actions/types.js";

// initial state would be empty array
const initialState = [];

// it will take two inputs the state and action, so that current state in which the system is and what action is
// to be performed
export default function (state = initialState, action) {
  // an actions consists, a type of action and the payload (which consists some data)
  // it is quite logical as the type is to be defined that specifically which action is to be performed
  // that's why the switch is based on the type of the action
  // and any function that is to be performed based on the payload
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
}

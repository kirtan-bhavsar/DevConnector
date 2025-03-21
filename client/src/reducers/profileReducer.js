import { PROFILE_ERROR, GET_PROFILE, CLEAR_PROFILE } from "../actions/types.js";

const initialState = {
  profile: null,
  profiles: [],
  repos: {},
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        loading: false,
        profile: null,
        repos: [],
      };
    default:
      return state;
  }
}

import axios from "axios";
import { GET_PROFILE, PROFILE_ERROR } from "./types.js";
import { setAlert } from "../actions/alertAction.js";

const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/profile/me");

    console.log(
      JSON.stringify(res.data) +
        " ---res.data is being printed in getCurrentProfile"
    );

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (error) {
    // console.log(JSON.stringify(error.response) + " --- Error Response vanilla");
    // console.log(
    //   JSON.stringify({
    //     msg: error.response.statusText,
    //     status: error.response.status,
    //   }) + "  --- Error Response for statuses"
    // );
    dispatch({
      type: PROFILE_ERROR,
      // payload: error.response,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// Action to create/update the profile
const createProfile =
  (formData, edit = false) =>
  async (dispatch) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post("/api/profile", formData, config);

      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });

      dispatch(
        setAlert(edit ? "Profile updated" : "Profile created", "success")
      );

      return true;
    } catch (error) {
      const errors = error.response.data.errors;

      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
      }

      dispatch({
        type: PROFILE_ERROR,
        // payload: error.response,
        payload: {
          msg: error.response.statusText,
          status: error.response.status,
        },
      });

      return false;
    }
  };

export { getCurrentProfile, createProfile };

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { getCurrentProfile } from "../../actions/profileAction.js";
import Spinner from "../../spinner/Spinner.js";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { profile, loading } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  // const {profile,loading} = userProfile;

  useEffect(() => {
    dispatch(getCurrentProfile());
  }, [getCurrentProfile]);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome {user && user.name}
      </p>
      {profile !== null ? (
        <>has</>
      ) : (
        <>
          <p>You do not have any profile to display. Please add to showcase</p>{" "}
          <Link className="btn btn-primary my-1" to="/create-profile">
            Create Profile
          </Link>{" "}
        </>
      )}
    </>
  );
};

export default Dashboard;

// import React from "react";

// const Dashboard = () => {

//   return <>Dashboard</>;
// };

// export default Dashboard;

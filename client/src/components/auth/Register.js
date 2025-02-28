// import React, { useEffect } from "react";
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { connect } from "react-redux";
// import { setAlert } from "../../actions/alertAction.js";
// import { register } from "../../actions/authAction.js";
// import PropTypes from "prop-types";

// // Defining the state for Register Functionality
// const Register = ({ setAlert, register, isAuthenticated }) => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const { name, email, password, confirmPassword } = formData;

//   const onChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const onSubmit = async (e) => {
//     e.preventDefault();

//     if (password === confirmPassword) {
//       // if not using redux, we can use the APIs in this way and update the data accordingly.
//       // try {
//       //   const newUser = {
//       //     name,
//       //     email,
//       //     password,
//       //   };

//       //   const config = {
//       //     headers: {
//       //       "Content-Type": "application/json",
//       //     },
//       //   };

//       //   const body = JSON.stringify(newUser);

//       //   const res = await axios.post("/api/users/register", body, config);
//       //   console.log(res.data);
//       // } catch (error) {
//       //   console.log(error.message);
//       // }

//       // console.log("SUCCESS");

//       register({ name, email, password });
//     } else {
//       setAlert("Password does not matches", "danger", 2500);
//     }
//   };

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate("/dashboard");
//     }
//   }, [isAuthenticated, navigate]);

//   return (
//     <>
//       <h1 className="large text-primary">Sign Up</h1>
//       <p className="lead">
//         <i className="fas fa-user"></i> Create Your Account
//       </p>
//       <form onSubmit={onSubmit} className="form" action="create-profile.html">
//         <div className="form-group">
//           <input
//             type="text"
//             placeholder="Name"
//             name="name"
//             value={name}
//             onChange={(e) => onChange(e)}
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="email"
//             placeholder="Email Address"
//             name="email"
//             value={email}
//             onChange={(e) => onChange(e)}
//           />
//           <small className="form-text">
//             This site uses Gravatar so if you want a profile image, use a
//             Gravatar email
//           </small>
//         </div>
//         <div className="form-group">
//           <input
//             type="password"
//             placeholder="Password"
//             name="password"
//             minLength="6"
//             value={password}
//             onChange={(e) => onChange(e)}
//           />
//         </div>
//         <div className="form-group">
//           <input
//             type="password"
//             placeholder="Confirm Password"
//             name="confirmPassword"
//             minLength="6"
//             value={confirmPassword}
//             onChange={(e) => onChange(e)}
//           />
//         </div>
//         <input type="submit" className="btn btn-primary" value="Register" />
//       </form>
//       <p className="my-1">
//         Already have an account? <Link to="/login">Login</Link>
//       </p>
//     </>
//   );
// };

// Register.propTypes = {
//   setAlert: PropTypes.func.isRequired,
//   register: PropTypes.func.isRequired,
//   isAuthenticated: PropTypes.bool,
// };

// const mapStateToProps = (state) => ({
//   isAuthenticated: state.auth.isAuthenticated,
// });

// export default connect(mapStateToProps, { setAlert, register })(Register);

// --- Updated Code ---

// import React, { useEffect } from "react";
// import { useState } from "react";
// import { connect } from "react-redux";
// import PropTypes from "prop-types";

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setAlert } from "../../actions/alertAction.js";
import { register } from "../../actions/authAction.js";
import { useDispatch, useSelector } from "react-redux";

// Defining the state for Register Functionality
const Register = () => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      // if not using redux, we can use the APIs in this way and update the data accordingly.
      // try {
      //   const newUser = {
      //     name,
      //     email,
      //     password,
      //   };

      //   const config = {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   };

      //   const body = JSON.stringify(newUser);

      //   const res = await axios.post("/api/users/register", body, config);
      //   console.log(res.data);
      // } catch (error) {
      //   console.log(error.message);
      // }

      // console.log("SUCCESS");

      dispatch(register({ name, email, password }));
    } else {
      dispatch(setAlert("Password does not matches", "danger", 2500));
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form onSubmit={onSubmit} className="form" action="create-profile.html">
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            minLength="6"
            value={confirmPassword}
            onChange={(e) => onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </>
  );
};

export default Register;

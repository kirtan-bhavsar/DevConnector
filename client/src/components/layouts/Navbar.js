import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/authAction.js";

const Navbar = ({ auth: { loading, isAuthenticated }, logout }) => {
  const authLinks = (
    <>
      <ul>
        <li>
          <Link to="/dashboard">
            <i className="fa-regular fa-user"></i>{" "}
            <span className="hide-sm">Dashboard</span>
          </Link>
        </li>
        <li>
          <a onClick={logout} href="#!">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>{" "}
            <span className="hide-sm">Logout</span>
          </a>
        </li>
      </ul>
    </>
  );

  const guestLinks = (
    <>
      <ul>
        <li>
          <a href="#!">Developers</a>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </>
  );

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> DevConnector
        </Link>
      </h1>
      <>{!loading && <>{isAuthenticated ? authLinks : guestLinks}</>}</>
    </nav>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);

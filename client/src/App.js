import "./App.css";
import Navbar from "./components/layouts/Navbar.js";
import Landing from "./components/layouts/Landing.js";
import Login from "./components/auth/Login.js";
import Register from "./components/auth/Register.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Landing />} />
      </Routes>
    </Router>
  );
};
export default App;

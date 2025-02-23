import "./App.css";
import Navbar from "./components/layouts/Navbar.js";
import Landing from "./components/layouts/Landing.js";
import Login from "./components/auth/Login.js";
import Register from "./components/auth/Register.js";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Switch,
} from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route
          path="/*"
          element={
            <section className="container">
              <Routes>
                <Route path="/register" element={<Register />}></Route>
                <Route path="/login" element={<Login />}></Route>
              </Routes>
            </section>
          }
        ></Route>
      </Routes>
    </Router>
  );
};
export default App;

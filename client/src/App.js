import "./App.css";
import Navbar from "./components/layouts/Navbar.js";
import Landing from "./components/layouts/Landing.js";
import Login from "./components/auth/Login.js";
import Register from "./components/auth/Register.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store.js";
import Alert from "./components/layouts/Alert.js";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route
            path="/*"
            element={
              <section className="container">
                <Alert />
                <Routes>
                  <Route path="/register" element={<Register />}></Route>
                  <Route path="/login" element={<Login />}></Route>
                </Routes>
              </section>
            }
          ></Route>
        </Routes>
      </Router>
    </Provider>
  );
};
export default App;

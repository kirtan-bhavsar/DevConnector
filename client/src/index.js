import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import { Provider } from "react-redux";
// import store from "./store.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
  // <Provider store={store}>
  //   <App />
  // </Provider>
);

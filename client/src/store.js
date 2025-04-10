import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/index.js";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: true,
});

export default store;

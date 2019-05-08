import React from "react";
import ReactDOM from "react-dom";
import rootReducer from "./store/reducers";
import { createStore } from "redux";
import { Provider } from "react-redux";
import App from "./App";

const store = createStore(rootReducer);

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);

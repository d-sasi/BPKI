import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <div className="title">
        <p>BPKI</p>
        <p>BPKI</p>
        <p>Blockchain based Public Key Infrastructure</p>
    </div>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

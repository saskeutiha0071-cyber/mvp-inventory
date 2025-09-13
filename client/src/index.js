import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // этот файл App.js должен быть в src
import "./index.css";   // если у тебя есть стили

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

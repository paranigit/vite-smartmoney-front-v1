import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import MainRoute from "./routes/MainRoute";

function App() {
  return <MainRoute />;
}

export default App;

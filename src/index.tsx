import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import router from "@/router";
import { InitProvider } from "./contexts/initContext";

const GlobalStyling = createGlobalStyle`
  * {
    box-sizing  : content-box;
  }
  body {
    margin : 0px;
    background-color : #FFF
  }
`;
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <InitProvider>
      <ThemeProvider theme={{}}>
        <GlobalStyling />
        <RouterProvider router={router} />
      </ThemeProvider>
    </InitProvider>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import router from "@/router";
import { InitProvider } from "./contexts/initContext";
import { ModalProvider } from "./contexts/ModalContext";
import { theme } from "./constants/theme";
import { PlayerProvider } from "./contexts/PlayerContext";

const GlobalStyling = createGlobalStyle`
  * {
    box-sizing  : border-box;
    color : #222;

  }
  body {
    margin : 0px;
    padding : 0px;
    background-color : #FFF
  }
`;
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={{}}>
      <InitProvider>
        <ModalProvider>
          <PlayerProvider>
            <GlobalStyling />
            <RouterProvider router={router} />
          </PlayerProvider>
        </ModalProvider>
      </InitProvider>
    </ThemeProvider>
  </React.StrictMode>
);

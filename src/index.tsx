import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import router from "@/router";
import { Layout } from "@/components/common";

const GlobalStyling = createGlobalStyle`
  * {
    box-sizing  : content-box;
  }
  body {
    margin : 0px;
  }
`;
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={{}}>
      <GlobalStyling />
      <Layout>
        <RouterProvider router={router} />
      </Layout>
    </ThemeProvider>
  </React.StrictMode>
);

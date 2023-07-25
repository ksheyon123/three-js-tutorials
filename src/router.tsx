import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "@/pages/App";
import { Error } from "@/pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
  },
  {
    path: "404",
    element: <Error />,
  },
]);

export default router;

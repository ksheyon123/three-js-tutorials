import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Sphere from "@/pages/Sphere";
import { Error } from "@/pages/Error";
import Plane from "./pages/Plane";
import App from "./pages/App";
import ThreeLayout from "./components/Three/ThreeLayout/ThreeLayout";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      errorElement: <Error />,
      children: [
        {
          path: "map",
          element: <ThreeLayout />,
          children: [
            {
              path: "sphere",
              element: <Sphere />,
            },
            {
              path: "plane",
              element: <Plane />,
            },
          ],
        },
      ],
    },
  ],
  { basename: "/" }
);

export default router;

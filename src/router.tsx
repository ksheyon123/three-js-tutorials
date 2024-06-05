import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Error } from "@/pages/Error";
import Plane from "./pages/Plane";
import Space from "@/pages/Space";
import SpaceLayout from "@/components/pageComponent/Space/Layout/Layout";
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
              path: "space",
              element: <Space />,
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

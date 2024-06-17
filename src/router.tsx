import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Error } from "@/pages/Error";
import Plane from "@/pages/Plane";
import Space from "@/pages/Space";
import App from "./pages/App";
import ThreeLayout from "@/components/Three/ThreeLayout/ThreeLayout";
import DefenseGame from "@/pages/DefenseGame";

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
        {
          path: "game",
          element: <ThreeLayout />,
          children: [
            {
              path: "defense",
              element: <DefenseGame />,
            },
          ],
        },
      ],
    },
  ],
  { basename: "/" }
);

export default router;

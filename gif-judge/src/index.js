import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
  // Navigate,
} from "react-router-dom";
import ErrorPage from "./error-page";
import GifLanding from "./GifLanding"
import GameHome from "./GameHome"

const router = createBrowserRouter([
  {
    path: "/",
    element: <GifLanding />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/gif-judge",
    element: <GifLanding />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/gif-judge/:gameId",
    element: <GameHome />,
    errorElement: <ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

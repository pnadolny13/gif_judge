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
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

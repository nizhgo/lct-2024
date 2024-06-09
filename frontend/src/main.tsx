import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./assets/theme.ts";
import PassengerPage from "src/views/passenger/passenger.page.tsx";
import WorkerRegPage from "src/views/workers/resigtration/workerReg.page.tsx";
import WorkersPage from "src/views/workers/workers.page.tsx";
import RequestPage from "src/views/request/request.page.tsx";
import RequestDistribPage from "src/views/requestDistrib/requestDistrib.page.tsx";
import { LoginPage } from "src/views/login/login.page.tsx";
import { authService } from "src/stores/auth.service.ts";
import { NotFoundPage } from "src/views/404/notFound.page.tsx";
import { ErrorTemplate } from "components/error.tsx";
import { AppLayout } from "src/views/layout.tsx";
import MainPage from "src/mainPage.tsx";

const authLoader = () => {
  //todo rewrite this cringe auth check
  if (authService.auth.state === "unauthorized") {
    return redirect("/login");
  }
  return null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    loader: authLoader,
    errorElement: <ErrorTemplate />,
    children: [
      {
        path: "/",
        element: <MainPage />,
        loader: authLoader,
      },
      {
        path: "/passenger/:id",
        element: <PassengerPage />,
        loader: authLoader,
      },
      {
        path: "/worker",
        element: <WorkersPage />,
        loader: authLoader,
      },
      {
        path: "/worker/registration",
        element: <WorkerRegPage />,
        loader: authLoader,
      },
      {
        path: "/request/:id",
        element: <RequestPage />,
        loader: authLoader,
      },
      {
        path: "/request/distrib",
        element: <RequestDistribPage />,
        loader: authLoader,
      },
    ],
  },
  { path: "login", element: <LoginPage /> },
  { path: "*", element: <NotFoundPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <RouterProvider router={router} />
  </ThemeProvider>,
);
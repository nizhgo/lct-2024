import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./assets/theme.ts";
import PassengerPage from "src/views/passenger/passenger.page.tsx";
import WorkerRegPage from "src/views/workers/resigtration/workerReg.page.tsx";
import WorkersPage from "src/views/workers/workers.page.tsx";
import RequestPage from "src/views/request/request.page.tsx";
import { LoginPage } from "src/views/login/login.page.tsx";
import { authService } from "src/stores/auth.service.ts";
import { NotFoundPage } from "src/views/404/notFound.page.tsx";
import { ErrorTemplate } from "components/error.tsx";
import { AppLayout } from "src/views/layout.tsx";
import MainPage from "src/mainPage.tsx";
import { WorkerDetail } from "src/views/workers/detail/worker.detail.tsx";
import { PassengerForm } from "src/views/passenger/form/passenger-form.tsx";
import { PassengerDetails } from "src/views/passenger/details/passenger-form.tsx";
import RequestFormPage from "src/views/request/form/request.page.tsx";
import RequestDetailPage from "src/views/request/details/requestDetailPage.tsx";
import { ProfilePage } from "src/views/profile/worker.detail.tsx";

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
        path: "/passenger",
        element: <Outlet />,
        loader: authLoader,
        children: [
          {
            path: "/passenger/",
            element: <PassengerPage />,
            loader: authLoader,
          },
          {
            path: "/passenger/:id",
            element: <PassengerDetails />,
            loader: authLoader,
          },
          {
            path: "/passenger/new",
            element: <PassengerForm />,
            loader: authLoader,
          },
        ],
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
        path: "/worker/:id",
        element: <WorkerDetail />,
        loader: authLoader,
      },
      {
        path: "/request",
        element: <Outlet />,
        loader: authLoader,
        children: [
          {
            path: "/request",
            element: <RequestPage />,
            loader: authLoader,
          },
          {
            path: "/request/:id",
            element: <RequestDetailPage />,
            loader: authLoader,
          },
          {
            path: "/request/new",
            element: <RequestFormPage />,
            loader: authLoader,
          },
        ],
      },
      {
        path: "/profile",
        element: <ProfilePage />,
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

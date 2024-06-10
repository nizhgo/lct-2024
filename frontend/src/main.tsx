import ReactDOM from "react-dom/client";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./assets/theme.ts";
import PassengersPage from "src/views/passengers/passengers.page.tsx";
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
import { PassengerForm } from "src/views/passengers/form/passenger-form.tsx";
import { PassengerDetails } from "src/views/passengers/details/passenger-form.tsx";
import RequestFormPage from "src/views/request/form/request.page.tsx";
import RequestDetailPage from "src/views/request/details/requestDetailPage.tsx";
import { ProfilePage } from "src/views/profile/worker.detail.tsx";
import { SchedulePage } from "src/views/schedule/schedule.page.tsx";
import { ToastContainer } from "react-toastify";

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
        path: "/passengers",
        element: <Outlet />,
        loader: authLoader,
        children: [
          {
            path: "/passengers/",
            element: <PassengersPage />,
            loader: authLoader,
          },
          {
            path: "/passengers/:id",
            element: <PassengerDetails />,
            loader: authLoader,
          },
          {
            path: "/passengers/new",
            element: <PassengerForm />,
            loader: authLoader,
          },
        ],
      },
      {
        path: "/staff",
        element: <WorkersPage />,
        loader: authLoader,
      },
      {
        path: "/staff/registration",
        element: <WorkerRegPage />,
        loader: authLoader,
      },
      {
        path: "/staff/:id",
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
      {
        path: "/schedule",
        element: <SchedulePage />,
        loader: authLoader,
      },
    ],
  },
  { path: "login", element: <LoginPage /> },
  { path: "*", element: <NotFoundPage /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <ToastContainer />
    <RouterProvider router={router} />
  </ThemeProvider>,
);

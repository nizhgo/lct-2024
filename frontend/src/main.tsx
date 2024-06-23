import ReactDOM from "react-dom/client";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import {
  createBrowserRouter, Navigate,
  Outlet,
  redirect,
  RouterProvider
} from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./assets/theme.ts";
import PassengersPage from "src/views/passengers/passengers.page.tsx";
import StaffRegPage from "src/views/staff/form/staff.form.page.tsx";
import StaffPage from "src/views/staff/staff.page.tsx";
import { LoginPage } from "src/views/login/login.page.tsx";
import { NotFoundPage } from "src/views/404/notFound.page.tsx";
import { ErrorTemplate } from "components/error.tsx";
import { AppLayout } from "src/views/layout.tsx";
import { PassengerDetails } from "src/views/passengers/details/passenger.detail.page.tsx";
import { ProfilePage } from "src/views/profile/profile.detail.tsx";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import AuthService from "src/stores/auth.service.ts";
import { observer } from "mobx-react-lite";
import { Loader, LoaderWrapper } from "src/loader.tsx";
import { PassengerEditPage } from "src/views/passengers/edit/passenger.edit.page.tsx";
import PassengerFormPage from "src/views/passengers/form/passenger.form.page.tsx";
import StaffEditPage from "src/views/staff/edit/staff.edit.page.tsx";
import StaffDetail from "src/views/staff/detail/staff.detail.page.tsx";
import RequestsPage from "src/views/requests/requests.page.tsx";
import RequestDetail from "src/views/requests/details/request.detail.tsx";
import RequestCreatePage from "src/views/requests/form/request.form.tsx";
import CheckinPage from "src/views/staff/checkin.page.tsx";
import RequestEditPage from "src/views/requests/edit/request.edit.page.tsx";
import SchedulePage from "src/views/schedule/schedule.page.tsx";

const nonAuthCheck = () => {
  if (!AuthService.isLoading && !AuthService.user) {
    return redirect("/login");
  }
  return null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    loader: nonAuthCheck,
    errorElement: <ErrorTemplate />,
    children: [
      {
        path: "/",
        element: <Navigate to={"/requests"} />,
        errorElement: <ErrorTemplate />,
        loader: nonAuthCheck,
      },
      {
        path: "/passengers",
        element: <Outlet />,
        errorElement: <ErrorTemplate />,
        loader: nonAuthCheck,
        children: [
          {
            path: "/passengers/",
            element: <PassengersPage />,
          },
          {
            path: "/passengers/:id",
            element: <PassengerDetails />,
          },
          {
            path: "/passengers/edit/:id",
            element: <PassengerEditPage />,
          },
          {
            path: "/passengers/new",
            element: <PassengerFormPage />,
          },
        ],
      },
      {
        path: "/staff",
        element: <StaffPage />,
        errorElement: <ErrorTemplate />,
        loader: nonAuthCheck,
      },
      {
        path: "/staff/registration",
        element: <StaffRegPage />,
        loader: nonAuthCheck,
      },
      {
        path: "/staff/:id",
        element: <StaffDetail />,
        loader: nonAuthCheck,
      },
      {
        path: "/staff/:id/edit",
        element: <StaffEditPage />,
        loader: nonAuthCheck,
      },
      {
        path: "/staff/checkin",
        element: <CheckinPage />,
        loader: nonAuthCheck,
      },
      {
        path: "/requests",
        element: <Outlet />,
        errorElement: <ErrorTemplate />,
        loader: nonAuthCheck,
        children: [
          {
            path: "/requests",
            element: <RequestsPage />,
          },
          {
            path: "/requests/:id",
            element: <RequestDetail />,
          },
          {
            path: "/requests/new",
            element: <RequestCreatePage />,
          },
          {
            path: "/requests/edit/:id/",
            element: <RequestEditPage />,
          },
        ],
      },
      {
        path: "/profile",
        element: <ProfilePage />,
        errorElement: <ErrorTemplate />,
        loader: nonAuthCheck,
      },
      {
        path: "/schedule",
        element: <SchedulePage />,
        errorElement: <ErrorTemplate />,
        loader: nonAuthCheck,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/logout",
    loader: () => {
      AuthService.logout();
      return redirect("/login");
    },
  },
  { path: "*", element: <NotFoundPage /> },
]);

const Root = observer(() => {
  useEffect(() => {
    AuthService.init();
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      {AuthService.isLoading ? (
        <LoaderWrapper height={"100vh"}>
          <Loader />
        </LoaderWrapper>
      ) : (
        <RouterProvider router={router} />
      )}
    </ThemeProvider>
  );
});

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);

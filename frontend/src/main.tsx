import ReactDOM from "react-dom/client";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import {
  createBrowserRouter,
  Outlet,
  redirect,
  RouterProvider
} from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./assets/theme.ts";
import PassengersPage from "src/views/passengers/passengers.page.tsx";
import StaffRegPage from "src/views/staff/resigtration/staffRegPage.tsx";
import StaffPage from "src/views/staff/staff.page.tsx";
import RequestPage from "src/views/request/request.page.tsx";
import { LoginPage } from "src/views/login/login.page.tsx";
import { NotFoundPage } from "src/views/404/notFound.page.tsx";
import { ErrorTemplate } from "components/error.tsx";
import { AppLayout } from "src/views/layout.tsx";
import MainPage from "src/mainPage.tsx";
import { StaffDetail } from "src/views/staff/detail/staff.detail.tsx";
import { PassengerForm } from "src/views/passengers/form/passenger-form.tsx";
import { PassengerDetails } from "src/views/passengers/details/passenger-form.tsx";
import RequestFormPage from "src/views/request/form/request.page.tsx";
import RequestDetailPage from "src/views/request/details/requestDetailPage.tsx";
import { ProfilePage } from "src/views/profile/profile.detail.tsx";
import { SchedulePage } from "src/views/schedule/schedule.page.tsx";
import { ToastContainer } from "react-toastify";
import { Loader, LoaderWrapper } from "src/loader.tsx";
import { useEffect } from "react";
import AuthService from "src/stores/auth.service.ts";
import { observer } from "mobx-react-lite";

const nonAuthCheck = () => {
  if (!AuthService.isLoading && !AuthService.user) {
    return redirect("/login");
  }
  return redirect("/login");
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
        element: <MainPage />,
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
            path: "/passengers/new",
            element: <PassengerForm />,
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
        path: "/request",
        element: <Outlet />,
        errorElement: <ErrorTemplate />,
        loader: nonAuthCheck,
        children: [
          {
            path: "/request",
            element: <RequestPage />,
          },
          {
            path: "/request/:id",
            element: <RequestDetailPage />,
          },
          {
            path: "/request/new",
            element: <RequestFormPage />,
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
    }
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
        <RouterProvider router={router}/>
        )}
    </ThemeProvider>
  );
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Root />
);


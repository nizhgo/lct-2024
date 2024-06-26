import { lazy, Suspense, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import { theme } from "./assets/theme.ts";
import { toast, ToastContainer } from "react-toastify";
import AuthService from "src/stores/auth.service.ts";
import { observer } from "mobx-react-lite";
import { Loader, LoaderWrapper } from "src/loader.tsx";
import PermissionsService, {
  Permission,
  Section,
} from "src/stores/permissions.service.ts";
import ChangelogPage from "src/views/changelog/changelog.page.tsx";

// Lazy loaded components
const PassengersPage = lazy(
  () => import("src/views/passengers/passengers.page.tsx"),
);
const StaffRegPage = lazy(
  () => import("src/views/staff/form/staff.form.page.tsx"),
);
const StaffPage = lazy(() => import("src/views/staff/staff.page.tsx"));
const LoginPage = lazy(() => import("src/views/login/login.page.tsx"));
const NotFoundPage = lazy(() => import("src/views/404/notFound.page.tsx"));
const ErrorTemplate = lazy(() => import("components/error.tsx"));
const AppLayout = lazy(() => import("src/views/layout.tsx"));
const PassengerDetails = lazy(
  () => import("src/views/passengers/details/passenger.detail.page.tsx"),
);
const ProfilePage = lazy(() => import("src/views/profile/profile.detail.tsx"));
const PassengerEditPage = lazy(
  () => import("src/views/passengers/edit/passenger.edit.page.tsx"),
);
const PassengerFormPage = lazy(
  () => import("src/views/passengers/form/passenger.form.page.tsx"),
);
const StaffEditPage = lazy(
  () => import("src/views/staff/edit/staff.edit.page.tsx"),
);
const StaffDetail = lazy(
  () => import("src/views/staff/detail/staff.detail.page.tsx"),
);
const RequestsPage = lazy(() => import("src/views/requests/requests.page.tsx"));
const RequestDetail = lazy(
  () => import("src/views/requests/details/request.detail.tsx"),
);
const RequestCreatePage = lazy(
  () => import("src/views/requests/form/request.form.tsx"),
);
const CheckinPage = lazy(() => import("src/views/staff/checkin.page.tsx"));
const RequestEditPage = lazy(
  () => import("src/views/requests/edit/request.edit.page.tsx"),
);
const SchedulePage = lazy(() => import("src/views/schedule/schedule.page.tsx"));

const securityCheck = (
  section?: Section,
  requiredPermissions?: Permission[],
) => {
  if (!AuthService.isLoading) {
    if (!AuthService.user) {
      return redirect("/login");
    }
    if (!section || !requiredPermissions) {
      return null;
    }
    const hasPermissions = PermissionsService.hasPermissions(
      section,
      requiredPermissions,
    );
    if (!hasPermissions) {
      toast.error("У вас нет доступа к этому разделу.");
      return redirect("/profile");
    }
  }
  return null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    loader: () => securityCheck(), // базовая проверка авторизации
    errorElement: <ErrorTemplate />,
    children: [
      {
        path: "/",
        element: <Navigate to={"/requests"} />,
        errorElement: <ErrorTemplate />,
        loader: () => securityCheck(),
      },
      {
        path: "/passengers",
        element: <Outlet />,
        errorElement: <ErrorTemplate />,
        loader: () => securityCheck("passengers", ["read"]),
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
            loader: () => securityCheck("passengers", ["update"]),
          },
          {
            path: "/passengers/new",
            element: <PassengerFormPage />,
            loader: () => securityCheck("passengers", ["create"]),
          },
        ],
      },
      {
        path: "/staff",
        element: <Outlet />,
        errorElement: <ErrorTemplate />,
        loader: () => securityCheck("staff", ["read"]),
        children: [
          {
            path: "/staff",
            element: <StaffPage />,
          },
          {
            path: "/staff/registration",
            element: <StaffRegPage />,
            loader: () => securityCheck("staff", ["create"]),
          },
          {
            path: "/staff/:id",
            element: <StaffDetail />,
          },
          {
            path: "/staff/:id/edit",
            element: <StaffEditPage />,
            loader: () => securityCheck("staff", ["update"]),
          },
          {
            path: "/staff/checkin",
            element: <CheckinPage />,
          },
        ],
      },
      {
        path: "/requests",
        element: <Outlet />,
        errorElement: <ErrorTemplate />,
        loader: () => securityCheck("requests", ["read"]),
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
            loader: () => securityCheck("requests", ["create"]),
          },
          {
            path: "/requests/edit/:id/",
            element: <RequestEditPage />,
            loader: () => securityCheck("requests", ["update"]),
          },
          {
            path: "/requests/changelog/:id/",
            element: <ChangelogPage />,
            loader: () => securityCheck("requests", ["update"]),
          },
        ],
      },
      {
        path: "/profile",
        element: <ProfilePage />,
        errorElement: <ErrorTemplate />,
        loader: () => securityCheck("profile", ["read"]),
      },
      {
        path: "/schedule",
        element: <SchedulePage />,
        errorElement: <ErrorTemplate />,
        loader: () => securityCheck("schedule", ["read"]),
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
        <Suspense
          fallback={
            <LoaderWrapper height={"100vh"}>
              <Loader />
            </LoaderWrapper>
          }
        >
          <RouterProvider router={router} />
        </Suspense>
      )}
    </ThemeProvider>
  );
});

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);

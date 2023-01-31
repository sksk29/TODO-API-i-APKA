import React from "react";
import { Navigate, RouteObject, useRoutes } from "react-router-dom";
import { AccountPage, TodosPage } from "../pages";
import { ProtectedRoute } from "./protected.route";

export const AppRoutes: React.FC = () => {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: <Navigate to="/todos" replace />
    },
    {
      path: "/todos",
      element: <ProtectedRoute component={TodosPage} />
    },
    {
      path: "/account",
      element: <ProtectedRoute component={AccountPage} />
    }
  ];
  const routing = useRoutes(routes);
  return routing;
};

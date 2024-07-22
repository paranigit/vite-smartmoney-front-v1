import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import PageHome from "../pages/PageHome";
import PageAccounts from "../pages/PageAccounts";
import PageAccountSets from "../pages/PageAccountSets";
import PageGraph from "../pages/PageGraph";
import PageLatestValues from "../pages/PageLatestValues";
import PageAddAccount from "../pages/PageAddAccount";

const Router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <PageHome /> },
      { path: "/home", element: <PageHome /> },
      { path: "/accounts", element: <PageAccounts /> },
      { path: "/accounts/add", element: <PageAddAccount /> },
      { path: "/accountsets", element: <PageAccountSets /> },
      { path: "/latestvalues", element: <PageLatestValues /> },
      { path: "/graph", element: <PageGraph /> },
    ],
  },
]);

export default function MainRoute() {
  return <RouterProvider router={Router} />;
}

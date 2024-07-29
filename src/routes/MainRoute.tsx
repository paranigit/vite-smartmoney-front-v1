import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import PageHome from "../pages/PageHome";
import PageAccounts from "../pages/PageAccounts";
import PageGraph from "../pages/PageGraph";
import PageLatestValues from "../pages/PageLatestValues";
import PageAddAccount from "../pages/PageAddAccount";
import PageAccountsetLinks from "../pages/PageAccountsetLinks";
import PageAddAccountsets from "../pages/pageAddAccountset";
import PageAccountsets from "../pages/PageAccountsets";

const Router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <PageHome /> },
      { path: "/home", element: <PageHome /> },
      { path: "/accounts", element: <PageAccounts /> },
      { path: "/accounts-add", element: <PageAddAccount /> },
      { path: "/accountsets", element: <PageAccountsets /> },
      { path: "/accountsets-add", element: <PageAddAccountsets /> },
      {
        path: "/accountset-links",
        element: <PageAccountsetLinks />,
      },
      {
        path: "/accountset-links/:accountset",
        element: <PageAccountsetLinks />,
      },
      { path: "/latestvalues", element: <PageLatestValues /> },
      { path: "/graph", element: <PageGraph /> },
    ],
  },
]);

export default function MainRoute() {
  return <RouterProvider router={Router} />;
}

// frontend/src/router.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import AddDemandePage from "./pages/AddDemandePage";
import ViewDemandePage from "./pages/ViewDemandePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      {
        path: "ajouter-demande",
        element: <AddDemandePage />,
      },
      {
        path: "demande-details/:id",
        element: <ViewDemandePage />,
      },
    ],
  },
]);

export default router;

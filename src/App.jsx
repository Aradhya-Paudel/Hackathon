import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Form from "./pages/Form";
import Pending from "./pages/Pending";
import Completed from "./pages/Completed";
import Cancelled from "./pages/Cancelled";
import Graph from "./pages/Graph";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/form",
      element: <Form />,
    },
    {
      path: "/pending",
      element: <Pending />,
    },
    {
      path: "/completed",
      element: <Completed />,
    },
    {
      path: "/cancelled",
      element: <Cancelled />,
    },
    {
      path: "/graph",
      element: <Graph />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

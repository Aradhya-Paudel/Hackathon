import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./userpages/Login";
import Register from "./userpages/Register";
import Form from "./userpages/Form";
import Pending from "./userpages/Pending";
import Completed from "./userpages/Completed";
import Cancelled from "./userpages/Cancelled";

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
  ]);

  return <RouterProvider router={router} />;
}

export default App;

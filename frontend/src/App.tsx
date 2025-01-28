import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Classroom from "./components/Classroom/Classroom";
import Landing from "./components/Landing/Landing";

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/room/:roomId", element: <Classroom /> },
  { path: "*", element: <Navigate to="/" /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

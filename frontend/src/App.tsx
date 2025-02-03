import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Classroom from "./components/Classroom/Classroom";
import Landing from "./components/Landing/Landing";

import { io } from "socket.io-client";
import { useEffect } from "react";
import useUserInformation from "./hooks/useUserInformation";
import axios from "axios";

export const socket = io("/");

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/room/:roomId", element: <Classroom /> },
  { path: "*", element: <Navigate to="/" /> },
]);

function App() {
  const { socketId, userData, setSocketId } = useUserInformation();

  useEffect(() => {
    socket.on("connection", (data) => {
      setSocketId(data);
    });
  }, [socket]);

  useEffect(() => {
    if (!userData?.id || !socketId) return;
    axios.post("/add-socket", { socketId, userId: userData.id });
  }, [userData, socketId]);

  return <RouterProvider router={router} />;
}

export default App;

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainLayout from "./Layout/MainLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Info from "./pages/Info.jsx";
import Experience from "./pages/Experience.jsx";
import Projects from "./pages/Projects.jsx";
import Skills from "./pages/Skills.jsx";
import Technology from "./pages/Technology.jsx";
import Login from "./pages/Login.jsx";
import Privateroute from "./privaterouter/Privateroute.jsx";
import Blogs from "./pages/Blogs.jsx";
import ReadBlog from "./pages/ReadBlog.jsx";
import Profiles from "./pages/Profiles.jsx";
import Category from "./pages/Category.jsx";
import Match from "./pages/Match.jsx";
import RoomDetails from "./pages/RoomDetails.jsx";
const router = createBrowserRouter([
  {
    path: "",
    element: <Privateroute> <MainLayout /></Privateroute>,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/category",
        element: <Category />,
      },
      {
        path: "/match",
        element: <Match />,
      },
      {
        path: "/room-details",
        element: <RoomDetails />,
      },
      {
        path: "/info",
        element: <Info />,
      },
      {
        path: "/profiles",
        element: <Profiles />,
      },
      {
        path: "/experience",
        element: <Experience />,
      },
      {
        path: "/projects",
        element: <Projects />,
      },
      {
        path: "/skills",
        element: <Skills />,
      },
      {
        path: "/technology",
        element: <Technology />,
      },
      {
        path: "/blogs",
        element: <Blogs />,
      },
      {
        path: "/blog/:title",
        element: <ReadBlog />,
      },

    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

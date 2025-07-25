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
import AddMatch from "./pages/AddMatch.jsx";
import RoomDetails from "./pages/RoomDetails.jsx";
import Deposits from "./pages/Deposits.jsx";
import WithDrawRequests from "./pages/WithDrawRequests.jsx";
import Settings from "./pages/Settings.jsx";
import AllMatch from "./pages/AllMatch.jsx";
import AddResult from "./pages/AddResult.jsx";
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
        path: "/deposits",
        element: <Deposits />,
      },
      {
        path: "/addmatch",
        element: <AddMatch />,
      },
      {
        path: "/addresult/:matchId",
        element: <AddResult />,
      },
      
      {
        path: "/allmatch",
        element: <AllMatch />,
      },
      {
        path: "/room-details",
        element: <RoomDetails />,
      },
      {
        path: "/withdraw-requests",
        element: <WithDrawRequests />,
      },
      {
        path: "/settings",
        element: <Settings />,
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

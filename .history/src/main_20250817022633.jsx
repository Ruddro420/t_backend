import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainLayout from "./Layout/MainLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Privateroute from "./privaterouter/Privateroute.jsx";
import Category from "./pages/Category.jsx";
import AddMatch from "./pages/AddMatch.jsx";
import RoomDetails from "./pages/RoomDetails.jsx";
import Deposits from "./pages/Deposits.jsx";
import WithDrawRequests from "./pages/WithDrawRequests.jsx";
import Settings from "./pages/Settings.jsx";
import AllMatch from "./pages/AllMatch.jsx";
import AddResult from "./pages/AddResult.jsx";
import Users from "./pages/Users.jsx";
import Payment from "./pages/Payment.jsx";
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
        path: "/users",
        element: <Users />,
      },
      {
        path: "/payment",
        element: <Payment />,
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

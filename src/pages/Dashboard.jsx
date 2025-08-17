/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { FaGamepad } from "react-icons/fa";
import { GiTabletopPlayers, GiTargetPrize } from "react-icons/gi";
import { MdAccountBalanceWallet } from "react-icons/md";
import Loader from "../components/Loader";
import axios from "axios";
import { PiHandDeposit } from "react-icons/pi";
import { IoCashOutline } from "react-icons/io5";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;
  const [dashboardData, setDashboardData] = useState();

  // Load all categories
  const fetchDashboard = () => {
    setLoading(true);
    axios
      .get(`${VITE_SERVER_API}/statistics`)
      .then((res) => {
        setDashboardData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  console.log(dashboardData);

  return (
    <div className="lg:p-6 py-6 space-y-6">
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* deposits */}
          <div className="border border-gray-500 flex flex-col gap-4 rounded-lg lg:p-6 p-4">
            <div className="title text-md lg:font-bold font-semibold flex gap-2 items-center">
              <PiHandDeposit />
              Total Deposits
            </div>
            <div className="data">{dashboardData?.total_deposit} BDT</div>
          </div>
          {/* Total Match */}
          <div className="border border-gray-500 flex flex-col gap-4 rounded-lg lg:p-6 p-4">
            <div className="title text-md lg:font-bold font-semibold flex gap-2 items-center">
              <FaGamepad />
              Total Match
            </div>
            <div className="data">2{dashboardData?.total_match}</div>
          </div>
          {/* Total Withdraw */}
          <div className="border border-gray-500 flex flex-col gap-4 rounded-lg lg:p-6 p-4">
            <div className="title text-md lg:font-bold font-semibold flex gap-2 items-center">
              <IoCashOutline />
              Total Withdraw
            </div>
            <div className="data">{dashboardData?.total_withdraw} BDT</div>
          </div>
          {/* Total Played */}
          <div className="border border-gray-500 flex flex-col gap-4 rounded-lg lg:p-6 p-4">
            <div className="title text-md lg:font-bold font-semibold flex gap-2 items-center">
              {" "}
              <GiTabletopPlayers />
              Total Played
            </div>
            <div className="data">{dashboardData?.total_played}</div>
          </div>
          {/* Total Played Prize */}
          <div className="border border-gray-500 flex flex-col gap-4 rounded-lg lg:p-6 p-4">
            <div className="title text-md lg:font-bold font-semibold flex gap-2 items-center">
              <GiTargetPrize />
              Total Played Prize
            </div>
            <div className="data">{dashboardData?.total_played_prize} BDT</div>
          </div>

          <div className="border border-gray-500 flex flex-col gap-4 rounded-lg lg:p-6 p-4">
            <div className="title text-md lg:font-bold font-semibold flex gap-2 items-center">
              <MdAccountBalanceWallet />
              Net Balance
            </div>
            <div className="data">
              {dashboardData?.total_deposit - dashboardData?.total_played_prize} BDT
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

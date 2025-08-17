/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const AddResult = () => {
  const { matchId } = useParams();
  const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;

  const [loader, setLoader] = useState(true);
  const [matchDetails, setMatchDetails] = useState({});
  const [results, setResults] = useState([]);
  const [winner, setWinner] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");
  const [fourth, setFourth] = useState("");
  const [fifth, setFifth] = useState("");
  const [sixth, setSixth] = useState("");

  // fetch match details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchRes = await fetch(`${VITE_SERVER_API}/get/matches/${matchId}`);
        const matchData = await matchRes.json();
        setMatchDetails(matchData);

        const initialResults = matchData.joins.map((join) => ({
          user_id: join.user_id,
          ex_1: join.ex1,
          pname1_kill: 0,
          pname2_kill: 0,
          pname3_kill: 0,
          pname4_kill: 0,
          custom_prize: 0,
          total_prize: 0,
        }));

        setResults(initialResults);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoader(false);
      }
    };

    fetchData();
  }, []);

  // input handler
  const handleInputChange = (index, field, value) => {
    const updated = [...results];
    updated[index][field] = parseInt(value) || 0;

    const killPrice = parseInt(matchDetails.kill_price) || 0;
    const totalKills =
      (updated[index].pname1_kill || 0) +
      (updated[index].pname2_kill || 0) +
      (updated[index].pname3_kill || 0) +
      (updated[index].pname4_kill || 0);

    updated[index].total_prize =
      totalKills * killPrice + (updated[index].custom_prize || 0);

    setResults(updated);
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      match_id: matchId,
      winner,
      second,
      third,
      fourth,
      fifth,
      sixth,
      result: results,
    };

    try {
      const res = await fetch(`http://192.168.1.104:8000/api/match-result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Results submitted successfully!");
      } else {
        toast.error(data.message || "Submission failed.");
      }
    } catch (err) {
      console.error("❌ Submit error:", err);
      toast.error("Error submitting results.");
    }
  };

  return (
    <div className="lg:p-6 py-6 space-y-6">
      <h2 className="text-2xl font-semibold text-blue-500">
        Add Result (#{matchDetails?.match_id}-{matchDetails?.match_name})
      </h2>

      {/* Winner selection */}
      <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-2 gap-6 mt-4">
        {[
          { label: "Winner", state: winner, setter: setWinner, prize: matchDetails?.win_price },
          { label: "2nd Position", state: second, setter: setSecond, prize: matchDetails?.second_prize },
          { label: "3rd Position", state: third, setter: setThird, prize: matchDetails?.third_prize },
          { label: "4th Position", state: fourth, setter: setFourth, prize: matchDetails?.fourth_prize },
          { label: "5th Position", state: fifth, setter: setFifth, prize: matchDetails?.fifth_prize },
        ].map((pos, i) => (
          <div key={i}>
            <label className="text-sm font-medium text-gray-200 block mb-2">
              Select {pos.label} ({pos.prize})
            </label>
            <select
              value={pos.state}
              onChange={(e) => pos.setter(e.target.value)}
              className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5"
            >
              <option value="">Select {pos.label}</option>
              {matchDetails?.joins?.map((player, idx) => (
                <option key={idx} value={player.user_id}>
                  {player.pname1}
                  {player.pname2 && ` & ${player.pname2}`}
                  {player.pname3 && ` & ${player.pname3}`}
                  {player.pname4 && ` & ${player.pname4}`}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Player table */}
      <div>
        <h2 className="text-xl font-semibold text-gray-200 mt-6">Add Score</h2>
        <br />
        {!loader ? (
          <form onSubmit={handleSubmit}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-800 text-left">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-200">#</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-200">User ID</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-200">Player 1 Kill</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-200">Player 2 Kill</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-200">Player 3 Kill</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-200">Player 4 Kill</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-200">Extra Prize</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-200">Total Prize</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700 text-left">
                  {matchDetails.joins?.map((player, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 text-sm text-gray-200">{i + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-200">{player.user_id}</td>
                      {[1, 2, 3, 4].map((num) => (
                        <td key={num} className="px-6 py-4">
                          {player[`pname${num}`] && (
                            <input
                              type="number"
                              className="w-20 p-1 rounded bg-gray-700 text-white"
                              value={results[i]?.[`pname${num}_kill`] || 0}
                              onChange={(e) =>
                                handleInputChange(i, `pname${num}_kill`, e.target.value)
                              }
                            />
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          className="w-20 p-1 rounded bg-gray-700 text-white"
                          value={results[i]?.custom_prize || 0}
                          onChange={(e) =>
                            handleInputChange(i, "custom_prize", e.target.value)
                          }
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-200">
                        {results[i]?.total_prize || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="shadow-sm bg-blue-800 border text-white sm:text-sm rounded-lg block w-full p-2.5 cursor-pointer"
              >
                Submit Result
              </button>
            </div>
          </form>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default AddResult;

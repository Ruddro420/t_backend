/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const AddResult = () => {
    const { matchId } = useParams();
    const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;
    const [loader, setLoader] = useState(true);
    const [matchDetails, setMatchDetails] = useState({});
    const [results, setResults] = useState([]);
    const [winner, setWinner] = useState(null);
    const [second, setSecond] = useState(null);
    const [third, setThird] = useState(null);
    const [fourth, setFourth] = useState(null);
    const [fifth, setFifth] = useState(null);
    const [sixth, setSixth] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const matchRes = await fetch(`${VITE_SERVER_API}/get/matches/${matchId}`);
                const matchData = await matchRes.json();
                setMatchDetails(matchData);

                const initialResults = matchData.joins.map(join => ({
                    user_id: join.user_id,
                    ex_1: join.ex1,
                    pname1_kill: 0,
                    pname2_kill: 0,
                    pname3_kill: 0,
                    pname4_kill: 0,
                    custom_prize: 0,
                    total_prize: 0
                }));

                const resultRes = await fetch(`${VITE_SERVER_API}/get/match-results/${matchId}`);
                const resultData = await resultRes.json();

                if (resultData?.player_results) {
                    const updatedResults = matchData.joins.map(join => {
                        const existing = resultData.player_results.find(r => r.user_id === join.user_id);
                        return existing
                            ? {
                                ...existing,
                                ex_1: join.ex1,
                                pname1_kill: parseInt(existing.pname1_kill) || 0,
                                pname2_kill: parseInt(existing.pname2_kill) || 0,
                                pname3_kill: parseInt(existing.pname3_kill) || 0,
                                pname4_kill: parseInt(existing.pname4_kill) || 0,
                                custom_prize: parseInt(existing.custom_prize) || 0,
                                total_prize: ((
                                    (parseInt(existing.pname1_kill) || 0) +
                                    (parseInt(existing.pname2_kill) || 0) +
                                    (parseInt(existing.pname3_kill) || 0) +
                                    (parseInt(existing.pname4_kill) || 0)
                                ) * parseInt(matchData.kill_price)) + (parseInt(existing.custom_prize) || 0)
                            }
                            : {
                                user_id: join.user_id,
                                ex_1: join.ex1,
                                pname1_kill: 0,
                                pname2_kill: 0,
                                pname3_kill: 0,
                                pname4_kill: 0,
                                custom_prize: 0,
                                total_prize: 0
                            };
                    });

                    setResults(updatedResults);
                    setWinner(resultData.winner || '');
                    setSecond(resultData.second || '');
                    setThird(resultData.third || '');
                    setFourth(resultData.fourth || '');
                    setFifth(resultData.fifth || '');
                    setSixth(resultData.sixth || '');
                    setIsEditMode(true);
                } else {
                    setResults(initialResults);
                }
            } catch (error) {
                console.error("Error fetching match/result data:", error);
            } finally {
                setLoader(false);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (index, field, value) => {
        const updatedResults = [...results];
        updatedResults[index][field] = parseInt(value) || 0;

        const killPrice = parseInt(matchDetails.kill_price) || 0;
        const totalKills = (
            parseInt(updatedResults[index].pname1_kill) || 0
        ) + (
                parseInt(updatedResults[index].pname2_kill) || 0
            ) + (
                parseInt(updatedResults[index].pname3_kill) || 0
            ) + (
                parseInt(updatedResults[index].pname4_kill) || 0
            );

        updatedResults[index].total_prize = (totalKills * killPrice) + parseInt(updatedResults[index].custom_prize) || 0;
        setResults(updatedResults);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const resultPayload = {
            match_id: matchId,
            winner,
            second,
            third,
            fourth,
            fifth,
            sixth,
            result: results
        };
        console.log(resultPayload)

        const endpoint = isEditMode ? `${VITE_SERVER_API}/edit/match-results/${matchId}` : `${VITE_SERVER_API}/match-result`;
        const method = isEditMode ? 'PUT' : 'POST';

        fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(resultPayload),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    toast.success(isEditMode ? 'Results updated successfully!' : 'Results submitted successfully!');
                } else {
                    toast.error('Submission failed.');
                }
            })
            .catch(err => {
                console.error('❌ Error submitting results:', err);
                toast.error('Error submitting results.');
            });
    };

    return (
        <div className="lg:p-6 py-6 space-y-6">
            <h2 className="text-2xl font-semibold text-blue-500">
                {isEditMode ? "Edit Result" : "Add Result"} (#{matchDetails?.match_id}-{matchDetails?.match_name})
            </h2>

            <div className='grid lg:grid-cols-2 md:grid-cols-2 grid-cols-2 gap-6 mt-4'>
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
                            {matchDetails?.joins?.map((player, i) => (
                                <option key={i} value={player?.user_id}>
                                    {player.pname1}  {player.pname2 && `& ${player.pname2}`} {player.pname3 && `& ${player.pname3}`} {player.pname4 && `& ${player.pname4}`}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-200 mt-6">Add Score</h2>
                <br />
                <div>
                    {!loader ? (
                        <form onSubmit={handleSubmit}>
                            <div className='overflow-x-auto'>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-800 text-left">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-200"></th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-200">Player 1</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-200">Player 1 Kill</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-200">Player 2</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-200">Player 2 Kill</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-200">Player 3</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-200">Player 3 Kill</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-200">Player 4</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-200">Player 4 Kill</th>
                                            <th className="px-6 py-3 text-xs font-medium text-gray-200">Extra Prize</th>

                                            <th className="px-6 py-3 text-xs font-medium text-gray-200">Total Prize</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gray-800 divide-y divide-gray-700 text-left">
                                        {matchDetails.joins?.map((item, i) => (
                                            <tr key={i}>
                                                <td className="px-6 py-4 text-sm text-gray-200">{i + 1}</td>
                                                <td className="px-6 py-4 text-sm text-gray-200">{item.pname1}</td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        className="w-24 p-1 rounded bg-gray-700 text-white"
                                                        value={results[i]?.pname1_kill || 0}
                                                        onChange={(e) => handleInputChange(i, 'pname1_kill', e.target.value)}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-200">{item.pname2 || ""}</td>
                                                <td className="px-6 py-4">
                                                    {item.pname2 && (
                                                        <input
                                                            type="number"
                                                            className="w-24 p-1 rounded bg-gray-700 text-white"
                                                            value={results[i]?.pname2_kill || 0}
                                                            onChange={(e) => handleInputChange(i, 'pname2_kill', e.target.value)}
                                                        />
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-200">{item.pname3 || ""}</td>
                                                <td className="px-6 py-4">
                                                    {item.pname3 && (
                                                        <input
                                                            type="number"
                                                            className="w-24 p-1 rounded bg-gray-700 text-white"
                                                            value={results[i]?.pname3_kill || 0}
                                                            onChange={(e) => handleInputChange(i, 'pname3_kill', e.target.value)}
                                                        />
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-200">{item.pname4 || ""}</td>
                                                <td className="px-6 py-4">
                                                    {item.pname4 && (
                                                        <input
                                                            type="number"
                                                            className="w-24 p-1 rounded bg-gray-700 text-white"
                                                            value={results[i]?.pname4_kill || 0}
                                                            onChange={(e) => handleInputChange(i, 'pname4_kill', e.target.value)}
                                                        />
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="number"
                                                        className="w-24 p-1 rounded bg-gray-700 text-white"
                                                        value={results[i]?.custom_prize || 0}
                                                        onChange={(e) => handleInputChange(i, 'custom_prize', e.target.value)}
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
                                <button disabled={isEditMode?true:false}
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
        </div>
    );
};

export default AddResult;

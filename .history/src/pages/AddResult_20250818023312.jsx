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
    const [winner, setWinner] = useState('');
    const [second, setSecond] = useState('');
    const [third, setThird] = useState('');
    const [fourth, setFourth] = useState('');
    const [fifth, setFifth] = useState('');
    const [sixth, setSixth] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoader(true);
                const [matchRes, resultRes] = await Promise.all([
                    fetch(`${VITE_SERVER_API}/get/matches/${matchId}`),
                    fetch(`${VITE_SERVER_API}/get/match-results/${matchId}`)
                ]);

                const matchData = await matchRes.json();
                setMatchDetails(matchData);

                const resultData = await resultRes.json();
                const hasExistingResults = resultData?.player_results?.length > 0;

                const initialResults = matchData.joins.map(join => {
                    if (hasExistingResults) {
                        const existing = resultData.player_results.find(r => r.user_id === join.user_id);
                        if (existing) {
                            return {
                                user_id: join.user_id,
                                ex_1: join.ex1,
                                pname1_kill: parseInt(existing.pname1_kill) || 0,
                                pname2_kill: parseInt(existing.pname2_kill) || 0,
                                pname3_kill: parseInt(existing.pname3_kill) || 0,
                                pname4_kill: parseInt(existing.pname4_kill) || 0,
                                custom_prize: parseInt(existing.custom_prize) || 0,
                                total_prize: (
                                    ((parseInt(existing.pname1_kill) || 0) +
                                    ((parseInt(existing.pname2_kill) || 0) +
                                    ((parseInt(existing.pname3_kill) || 0) +
                                    ((parseInt(existing.pname4_kill) || 0)
                                ) * (parseInt(matchData.kill_price) || 0) + 
                                (parseInt(existing.custom_prize) || 0)
                            };
                        }
                    }
                    return {
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

                setResults(initialResults);

                if (hasExistingResults) {
                    setWinner(resultData.winner || '');
                    setSecond(resultData.second || '');
                    setThird(resultData.third || '');
                    setFourth(resultData.fourth || '');
                    setFifth(resultData.fifth || '');
                    setSixth(resultData.sixth || '');
                    setIsEditMode(true);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load match data");
            } finally {
                setLoader(false);
            }
        };

        fetchData();
    }, [matchId]);

    const handleInputChange = (index, field, value) => {
        const updatedResults = [...results];
        const numericValue = parseInt(value) || 0;
        
        updatedResults[index][field] = numericValue;

        // Recalculate total prize
        const killPrice = parseInt(matchDetails.kill_price) || 0;
        const totalKills = 
            (parseInt(updatedResults[index].pname1_kill) || 0) +
            (parseInt(updatedResults[index].pname2_kill) || 0) +
            (parseInt(updatedResults[index].pname3_kill) || 0) +
            (parseInt(updatedResults[index].pname4_kill) || 0);

        updatedResults[index].total_prize = 
            (totalKills * killPrice) + 
            (parseInt(updatedResults[index].custom_prize) || 0);

        setResults(updatedResults);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate at least winner is selected
        if (!winner) {
            toast.error('Please select at least the winner');
            return;
        }

        const resultPayload = {
            match_id: matchId,
            winner,
            second,
            third,
            fourth,
            fifth,
            sixth,
            result: results.map(res => ({
                ...res,
                user_id: res.user_id.toString() // Ensure user_id is string if backend expects it
            }))
        };

        try {
            const res = await fetch(`${VITE_SERVER_API}/match-result`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resultPayload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to submit results');
            }

            toast.success(isEditMode ? 'Results updated successfully!' : 'Results submitted successfully!');
            setIsEditMode(true);
        } catch (err) {
            console.error('Error:', err);
            toast.error(err.message || 'Error submitting results');
        }
    };

    if (loader) {
        return <Loader />;
    }

    return (
        <div className="lg:p-6 py-6 space-y-6">
            <h2 className="text-2xl font-semibold text-blue-500">
                {isEditMode ? "Edit Result" : "Add Result"} (#{matchDetails?.match_id}-{matchDetails?.match_name})
            </h2>

            <div className='grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6 mt-4'>
                {[
                    { label: "Winner", state: winner, setter: setWinner, prize: matchDetails?.win_price },
                    { label: "2nd Position", state: second, setter: setSecond, prize: matchDetails?.second_prize },
                    { label: "3rd Position", state: third, setter: setThird, prize: matchDetails?.third_prize },
                    { label: "4th Position", state: fourth, setter: setFourth, prize: matchDetails?.fourth_prize },
                    { label: "5th Position", state: fifth, setter: setFifth, prize: matchDetails?.fifth_prize },
                    { label: "6th Position", state: sixth, setter: setSixth, prize: matchDetails?.sixth_prize || 0 },
                ].map((pos, i) => (
                    <div key={i}>
                        <label className="text-sm font-medium text-gray-200 block mb-2">
                            Select {pos.label} ({pos.prize || 0})
                        </label>
                        <select
                            value={pos.state}
                            onChange={(e) => pos.setter(e.target.value)}
                            className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5"
                        >
                            <option value="">Select {pos.label}</option>
                            {matchDetails?.joins?.map((player, i) => (
                                <option key={i} value={player.user_id}>
                                    {player.pname1} {player.pname2 && `& ${player.pname2}`} 
                                    {player.pname3 && `& ${player.pname3}`} {player.pname4 && `& ${player.pname4}`}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-200 mt-6">Add Score</h2>
                <br />
                <form onSubmit={handleSubmit}>
                    <div className='overflow-x-auto'>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-800 text-left">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-200">#</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-200">ID</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-200">Player 1</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-200">Kills</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-200">Player 2</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-200">Kills</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-200">Player 3</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-200">Kills</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-200">Player 4</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-200">Kills</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-200">Extra Prize</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-200">Total Prize</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700 text-left">
                                {matchDetails.joins?.map((item, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4 text-sm text-gray-200">{i + 1}</td>
                                        <td className="px-6 py-4 text-sm text-gray-200 flex items-center gap-2">
                                            <span className="truncate max-w-[80px]" title={item.user_id}>
                                                {item.user_id?.slice(0, 6)}...
                                            </span>
                                            <button
                                                type="button"
                                                className="bg-gray-700 hover:bg-gray-600 text-xs px-2 py-1 rounded text-white"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(item.user_id);
                                                    toast.success("User ID copied!");
                                                }}
                                            >
                                                Copy
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-200">{item.pname1}</td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                min="0"
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
                                                    min="0"
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
                                                    min="0"
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
                                                    min="0"
                                                    className="w-24 p-1 rounded bg-gray-700 text-white"
                                                    value={results[i]?.pname4_kill || 0}
                                                    onChange={(e) => handleInputChange(i, 'pname4_kill', e.target.value)}
                                                />
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                min="0"
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
                        <button
                            type="submit"
                            className="shadow-sm bg-blue-800 hover:bg-blue-700 text-white sm:text-sm rounded-lg block w-full p-2.5 cursor-pointer"
                        >
                            {isEditMode ? 'Update Result' : 'Submit Result'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddResult;
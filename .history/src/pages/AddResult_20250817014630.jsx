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
    const [positions, setPositions] = useState({
        winner: null,
        second: null,
        third: null,
        fourth: null,
        fifth: null,
        sixth: null
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoader(true);
                const [matchRes, resultRes] = await Promise.all([
                    fetch(`${VITE_SERVER_API}/get/matches/${matchId}`),
                    fetch(`${VITE_SERVER_API}/get/match-results/${matchId}`)
                ]);

                const matchData = await matchRes.json();
                const resultData = await resultRes.json();

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

                if (resultData?.player_results) {
                    const updatedResults = matchData.joins.map(join => {
                        const existing = resultData.player_results.find(r => r.user_id === join.user_id);
                        if (existing) {
                            const killPrice = parseInt(matchData.kill_price) || 0;
                            const totalKills = (
                                (parseInt(existing.pname1_kill) || 0) +
                                (parseInt(existing.pname2_kill) || 0) +
                                (parseInt(existing.pname3_kill) || 0) +
                                (parseInt(existing.pname4_kill) || 0);
                            
                            return {
                                ...existing,
                                ex_1: join.ex1,
                                pname1_kill: parseInt(existing.pname1_kill) || 0,
                                pname2_kill: parseInt(existing.pname2_kill) || 0,
                                pname3_kill: parseInt(existing.pname3_kill) || 0,
                                pname4_kill: parseInt(existing.pname4_kill) || 0,
                                custom_prize: parseInt(existing.custom_prize) || 0,
                                total_prize: (totalKills * killPrice) + (parseInt(existing.custom_prize) || 0)
                            };
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

                    setResults(updatedResults);
                    setPositions({
                        winner: resultData.winner || null,
                        second: resultData.second || null,
                        third: resultData.third || null,
                        fourth: resultData.fourth || null,
                        fifth: resultData.fifth || null,
                        sixth: resultData.sixth || null
                    });
                    setIsEditMode(true);
                } else {
                    setResults(initialResults);
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

        const killPrice = parseInt(matchDetails.kill_price) || 0;
        const totalKills = (
            (parseInt(updatedResults[index].pname1_kill) || 0) +
            (parseInt(updatedResults[index].pname2_kill) || 0) +
            (parseInt(updatedResults[index].pname3_kill) || 0) +
            (parseInt(updatedResults[index].pname4_kill) || 0)
        );

        updatedResults[index].total_prize = (totalKills * killPrice) + 
            (parseInt(updatedResults[index].custom_prize) || 0;

        setResults(updatedResults);
    };

    const handlePositionChange = (position, value) => {
        setPositions(prev => ({
            ...prev,
            [position]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const resultPayload = {
            match_id: matchId,
            winner: positions.winner,
            second: positions.second,
            third: positions.third,
            fourth: positions.fourth,
            fifth: positions.fifth,
            sixth: positions.sixth,
            result: results
        };

        try {
            const endpoint = isEditMode 
                ? `${VITE_SERVER_API}/edit/match-results/${matchId}` 
                : `${VITE_SERVER_API}/match-result`;
            
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(resultPayload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Submission failed');
            }

            toast.success(isEditMode ? 'Results updated successfully!' : 'Results submitted successfully!');
            setIsEditMode(true);
        } catch (err) {
            console.error('Error submitting results:', err);
            toast.error(err.message || 'Error submitting results');
        } finally {
            setIsSubmitting(false);
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

            <div className='grid lg:grid-cols-2 md:grid-cols-2 grid-cols-2 gap-6 mt-4'>
                {[
                    { label: "Winner", field: "winner", prize: matchDetails?.win_price },
                    { label: "2nd Position", field: "second", prize: matchDetails?.second_prize },
                    { label: "3rd Position", field: "third", prize: matchDetails?.third_prize },
                    { label: "4th Position", field: "fourth", prize: matchDetails?.fourth_prize },
                    { label: "5th Position", field: "fifth", prize: matchDetails?.fifth_prize },
                ].map((pos, i) => (
                    <div key={i}>
                        <label className="text-sm font-medium text-gray-200 block mb-2">
                            {pos.label} {pos.prize && `(${pos.prize})`}
                        </label>
                        <select
                            value={positions[pos.field] || ''}
                            onChange={(e) => handlePositionChange(pos.field, e.target.value)}
                            className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5"
                        >
                            <option value="">Select {pos.label} (Optional)</option>
                            {matchDetails?.joins?.map((player, i) => (
                                <option key={i} value={player.user_id}>
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

            <div>
                <h2 className="text-xl font-semibold text-gray-200 mt-6">Add Score</h2>
                <div className="mt-4">
                    <form onSubmit={handleSubmit}>
                        <div className='overflow-x-auto'>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-800 text-left">
                                    <tr>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-200">#</th>
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
                                disabled={isSubmitting}
                                className={`shadow-sm bg-blue-800 border text-white sm:text-sm rounded-lg block w-full p-2.5 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Result'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddResult;
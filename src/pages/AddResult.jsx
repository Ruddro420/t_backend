/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import Loader from '../components/Loader';

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

    useEffect(() => {
        fetch(`${VITE_SERVER_API}/get/matches/${matchId}`)
            .then((res) => res.json())
            .then((data) => {
                setMatchDetails(data);
                // Initialize result input fields for each joined player
                const initialResults = data.joins.map(join => ({
                    user_id: join.user_id,
                    pname1_kill: 0,
                    pname2_kill: 0,
                    total_prize: 0
                }));
                setResults(initialResults);
                setLoader(false);
            });
    }, []);

    const handleInputChange = (index, field, value) => {
        const updatedResults = [...results];
        updatedResults[index][field] = parseInt(value) || 0;
        updatedResults[index].total_prize =
            (updatedResults[index].pname1_kill + updatedResults[index].pname2_kill) * matchDetails.kill_price;
        setResults(updatedResults);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const resultPayload = {
            match_id: matchId,
            winner: winner,
            second: second,
            third: third,
            fourth: fourth,
            result: results
        };

        console.log("📦 Final Payload to be sent to backend:", resultPayload);

        fetch(`${VITE_SERVER_API}/add/result`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(resultPayload),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log('✅ Server Response:', data);
                if (data.success) {
                    alert('Results submitted successfully!');
                } else {
                    alert('Submission failed.');
                }
            })
            .catch(err => {
                console.error('❌ Error submitting results:', err);
                alert('Error submitting results.');
            });
    };


    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-blue-500">Add Result (#{matchDetails?.match_id}-{matchDetails?.match_name})</h2>
            <div className='grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1  gap-6 mt-4'>
                <div>
                    <label className="text-sm font-medium text-gray-200 block mb-2">
                        Select Winner<span className="text-red-500">*</span>
                    </label>
                    <select
                        value={winner}
                        onChange={(e) => setWinner(e.target.value)}
                        required
                        className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5"
                    >
                        <option value="">Select Winner</option>
                        {matchDetails?.joins?.map((player, i) => (
                            <option key={i} value={player.user_id}>
                                {player.pname1}  {player.pname2 && `& ${player.pname2}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-200 block mb-2">
                        Select 2nd Position<span className="text-red-500">*</span>
                    </label>
                    <select
                        value={second}
                        onChange={(e) => setSecond(e.target.value)}
                        required
                        className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5"
                    >
                        <option value="">Select 2nd</option>
                        {matchDetails?.joins?.map((player, i) => (
                            <option key={i} value={player.user_id}>
                                {player.pname1}  {player.pname2 && `& ${player.pname2}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-200 block mb-2">
                        Select 3rd Position<span className="text-red-500">*</span>
                    </label>
                    <select
                        value={third}
                        onChange={(e) => setThird(e.target.value)}
                        required
                        className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5"
                    >
                        <option value="">Select 3rd</option>
                        {matchDetails?.joins?.map((player, i) => (
                            <option key={i} value={player.user_id}>
                                {player.pname1}  {player.pname2 && `& ${player.pname2}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-200 block mb-2">
                        Select 4th Position<span className="text-red-500">*</span>
                    </label>
                    <select
                        value={fourth}
                        onChange={(e) => setFourth(e.target.value)}
                        required
                        className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5"
                    >
                        <option value="">Select 4th</option>
                        {matchDetails?.joins?.map((player, i) => (
                            <option key={i} value={player.user_id}>
                                {player.pname1}  {player.pname2 && `& ${player.pname2}`}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {/* then add 2nd, 3rd, 4rth, 5th */}
            <div >
                <h2 className="text-xl font-semibold text-gray-200 mt-6">Add Score</h2>
                <br />
                {!loader ? (
                    <form onSubmit={handleSubmit}>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-800 text-left">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-200"></th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Player 1</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Player 1 Kill</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Player 2</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Player 2 Kill</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Total Prize</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700 text-left">
                                {matchDetails.joins.map((item, i) => (
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
                                        <td className="px-6 py-4 text-sm text-gray-200">
                                            {results[i]?.total_prize || 0}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="bg-blue-800 text-white px-4 py-2 rounded cursor-pointer"
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

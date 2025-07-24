/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import Loader from '../components/Loader';

const ViewResult = () => {
    const { matchId } = useParams();
    const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;
    const [loader, setLoader] = useState(true);
    const [results, setResults] = useState([]);




    useEffect(() => {
        const fetchData = async () => {
            try {

                const resultRes = await fetch(`${VITE_SERVER_API}/get/match-results/${matchId}`);
                const resultData = await resultRes.json();

                if (resultData?.player_results) {
                    setResults(resultData);
                }
            } catch (error) {
                console.error("Error fetching match/result data:", error);
            } finally {
                setLoader(false);
            }
        };

        fetchData();
    }, []);





    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-blue-500"> View Results</h2>

            {/* then add 2nd, 3rd, 4rth, 5th */}
            <div >
                <h2 className="text-xl font-semibold text-gray-200 mt-6">Add Score</h2>
                <br />
                {!loader ? (

                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-800 text-left">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200"></th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Player</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Total Prize</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700 text-left">
                            {results?.player_results.map((item, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4 text-sm text-gray-200">{i + 1}</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">{item.ex_1}</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">{item.total_prize}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                ) : (
                    <Loader />
                )}
            </div>
        </div>
    );
};

export default ViewResult;

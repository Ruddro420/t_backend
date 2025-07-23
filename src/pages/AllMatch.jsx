/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { useState, useEffect } from 'react';
import Loader from "../components/Loader";
import { Link } from 'react-router';
const AllMatch = () => {
    const [matchList, setMatchList] = useState([]);
    const [loader, setLoader] = useState(true);
    const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;
    const VITE_FILE_API = import.meta.env.VITE_FILE_API;

    const fetchMatches = () => {
        axios
            .get(`${VITE_SERVER_API}/matches`)
            .then((res) => {
                setMatchList(res.data);
                setLoader(false);
            })
            .catch((err) => {
                console.error(err);
                setLoader(false);
            });
    };
    useEffect(() => {
        fetchMatches();
    }, []);
    return (

        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-blue-500">All Matches</h2>
            <div className="overflow-x-auto">
                {!loader ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200"></th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Match Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Max Players</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Map</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Version</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Total Prize</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {matchList && matchList.length > 0 ? matchList.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img className="w-10 h-10 rounded" src={`${VITE_FILE_API}/${item.category?.image}`} alt={item.name} />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-200">{item.match_name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">{item.category?.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">{item.max_player}</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">{item.map_name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">{item.version}</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">{item.date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">{item.time}</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">{item.total_prize}</td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <Link to={`/addresult/${item.id}`} className="btn">Add Result</Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="10" className="px-6 py-4 text-sm text-gray-200 text-center">No matches found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                ) : (
                    <Loader />
                )}
            </div>
        </div>

    );
};

export default AllMatch;
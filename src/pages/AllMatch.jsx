/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { useState, useEffect } from 'react';
import Loader from "../components/Loader";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AllMatch = () => {
    const [matchList, setMatchList] = useState([]);
    const [filteredMatches, setFilteredMatches] = useState([]);
    const [loader, setLoader] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [filters, setFilters] = useState({
        search: '',
        status: 'all',
        version: 'all',
        dateSort: 'newest'
    });
    
    const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;
    const VITE_FILE_API = import.meta.env.VITE_FILE_API;
    const navigate = useNavigate();

    const fetchMatches = () => {
        axios
            .get(`${VITE_SERVER_API}/matches`)
            .then((res) => {
                const sorted = res.data.sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));
                setMatchList(sorted);
                setFilteredMatches(sorted);
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

    // Filter matches based on filters state
    useEffect(() => {
        let filtered = [...matchList];
        
        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(match => 
                match.match_name.toLowerCase().includes(searchTerm) ||
                (match.category?.name?.toLowerCase().includes(searchTerm)) ||
                match.map_name.toLowerCase().includes(searchTerm) ||
                match.id.toLowerCase().includes(searchTerm) ||
                match.match_id.toLowerCase().includes(searchTerm) ||
                match.version.toLowerCase().includes(searchTerm)
            );
        }
        
        // Status filter
        if (filters.status !== 'all') {
            filtered = filtered.filter(match => 
                filters.status === 'active' ? 
                SetStatus(match.date, match.time) === 'Starting' : 
                SetStatus(match.date, match.time) === 'Ended'
            );
        }
        
        // Version filter
        if (filters.version !== 'all') {
            filtered = filtered.filter(match => 
                match.version.toLowerCase() === filters.version.toLowerCase()
            );
        }
        
        // Date sorting
        if (filters.dateSort === 'oldest') {
            filtered.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
        } else {
            filtered.sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));
        }
        
        setFilteredMatches(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [filters, matchList]);

    // SetStatus if match time ended then status = ended else active
    const SetStatus = (date, time) => {
        const matchDateTime = new Date(`${date}T${time}`);
        const now = new Date();
        return now > matchDateTime ? "Ended" : "Starting";
    }

    const ChangeStatuse = async (id, status) => {
        const request = axios.post(`${VITE_SERVER_API}/match-status/${id}/${status}`);
        toast.promise(request, {
            loading: "Updating...",
            success: "Status updated successfully!",
            error: "Something went wrong!",
        });
        request.then(() => fetchMatches());
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredMatches.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredMatches.length / itemsPerPage);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetFilters = () => {
        setFilters({
            search: '',
            status: 'all',
            version: 'all',
            dateSort: 'newest'
        });
    };

    return (
        <div className="lg:p-6 py-6 space-y-6">
            <h2 className="text-2xl font-semibold text-blue-500">All Matches</h2>
            
            {/* Filter Section */}
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Search Matches</label>
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search by name, category, map..."
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Status</label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Starting</option>
                            <option value="ended">Ended</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Version</label>
                        <select
                            name="version"
                            value={filters.version}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">All Versions</option>
                            <option value="mobile">Mobile</option>
                            <option value="pc">PC</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Sort By Date</label>
                        <select
                            name="dateSort"
                            value={filters.dateSort}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                {!loader ? (
                    <>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-200"></th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Match Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Max Players</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Map</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Version</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Total Prize</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {currentItems.length > 0 ? currentItems.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 text-sm text-gray-200">{item.id}</td>
                                        <td className="lg:px-6 pl-2 lg:py-4 whitespace-nowrap">
                                            <img className="w-10 h-10 rounded" src={`${VITE_FILE_API}/${item.category?.image}`} alt={item.name} />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-200">{item.match_name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-200">{item.category?.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-200">{item.max_player}</td>
                                        <td className="px-6 py-4 text-sm text-gray-200">{item.map_name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-200">{item.version}</td>
                                        <td className="px-6 py-4 text-sm text-gray-200">{item.date}</td>
                                        <td className="px-6 py-4 text-sm text-gray-200">{item.time}</td>
                                        <td className="px-6 py-4 text-sm text-gray-200">
                                            <span className={`${SetStatus(item.date, item.time) == "Starting" ? "bg-green-500" : "bg-red-500"} p-2 rounded-lg`}>
                                                {SetStatus(item.date, item.time)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-200">{item.total_prize}</td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <button 
                                                disabled={SetStatus(item.date, item.time) == "Ended" ? false : true} 
                                                onClick={() => navigate(`/addresult/${item.id}`)} 
                                                className="btn"
                                            >
                                                Add Result
                                            </button>
                                            <button 
                                                disabled={SetStatus(item.date, item.time) == "Ended" ? false : true} 
                                                onClick={() => ChangeStatuse(item.id, parseInt(item.status == 1 ? 0 : 1))} 
                                                className={`btn ${item.status == 1 ? "bg-red-500" : "bg-green-500"}`}
                                            >
                                                {item.status == 1 ? "Disable" : "Enable"}
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="11" className="px-6 py-4 text-sm text-gray-200 text-center">
                                            {matchList.length === 0 ? "No matches found" : "No matches match your filters"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        {filteredMatches.length > 0 && (
                            <div className="flex justify-between items-center mt-4 bg-gray-800 p-4 rounded-lg">
                                <div className="text-sm text-gray-400">
                                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredMatches.length)} of {filteredMatches.length} matches
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-600 text-white hover:bg-gray-500'}`}
                                    >
                                        Previous
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-4 py-2 rounded-md ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white hover:bg-gray-500'}`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-600 text-white hover:bg-gray-500'}`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <Loader />
                )}
            </div>
        </div>
    );
};

export default AllMatch;
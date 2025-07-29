/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";

const Users = () => {
    const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;

    const [userList, setUserList] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loader, setLoader] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [filters, setFilters] = useState({
        search: "",
        dateSort: "newest",
        status: "all"
    });

    const fetchUsers = () => {
        axios
            .get(`${VITE_SERVER_API}/firebase/users`)
            .then((res) => {
                setUserList(res.data);
                setLoader(false);
            })
            .catch((err) => {
                console.error(err);
                setLoader(false);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        // Apply filters whenever userList or filters change
        let result = [...userList];

        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            result = result.filter(user =>
                user.name.toLowerCase().includes(searchTerm) ||
                user.uid.toLowerCase().includes(searchTerm)
            )
        }

        // Status filter
        if (filters.status !== "all") {
            const statusFilter = filters.status === "disabled";
            result = result.filter(user => user.disabled === statusFilter);
        }

        // Date sort
        if (filters.dateSort === "newest") {
            result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else {
            result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }

        setFilteredUsers(result);
        setCurrentPage(1); // Reset to first page when filters change
    }, [userList, filters]);

    const disableUser = async (uid, isdisabled) => {
        if (isdisabled == false) {
            const res = await fetch(`${VITE_SERVER_API}/firebase/user/disable`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uid }),
            });

            const data = await res.json();
            console.log(data.message);
            fetchUsers();
        } else {
            const res = await fetch(`${VITE_SERVER_API}/firebase/user/enable`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uid }),
            });

            const data = await res.json();
            console.log(data.message);
            fetchUsers();
        }
    };

    // Get current users for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };


    //Date and Time Formater

    const formatDateandTime = (dateTimeString) => {
        const date = new Date(dateTimeString);

        // Get date components
        const month = date.getMonth() + 1; // Months are 0-based
        const day = date.getDate();
        const year = date.getFullYear();

        // Get time components
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        // Determine AM/PM
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Convert 0 to 12

        // Format minutes and seconds with leading zeros
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

        return `${month}/${day}/${year} ${hours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
    };



    return (
        <div className="lg:p-6 py-6 space-y-6">
            <h2 className="text-2xl font-semibold text-blue-500">All Users</h2>

            {/* Filter Section */}
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Search by Name/UID</label>
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Search..."
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Sort by Date</label>
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
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Status</label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">All Users</option>
                            <option value="disabled">Disabled</option>
                            <option value="active">Active</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={() => setFilters({
                                search: "",
                                dateSort: "newest",
                                status: "all"
                            })}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">User ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">User Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Action</th>
                        </tr>
                    </thead>
                    {!loader ? (
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {currentUsers?.map((user) => (
                                <tr key={user?.uid}>
                                    <td className="px-6 py-4 text-sm text-gray-200">#{user?.uid}</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">{user?.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">{user?.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">{formatDateandTime(user?.created_at)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">
                                        <span className={`px-2 py-1 rounded-full text-xs ${user.disabled ? 'bg-red-500' : 'bg-green-500'
                                            }`}>
                                            {user.disabled ? "Disabled" : "Active"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button
                                            className={`btn ${user.disabled ? 'bg-green-500' : 'bg-red-500'} text-white px-3 py-1 rounded-md`}
                                            onClick={() => disableUser(user.uid, user.disabled)}
                                        >
                                            {user.disabled ? "Enable" : "Disable"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {currentUsers.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center text-gray-400 py-4">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    ) : (
                        <Loader />
                    )}
                </table>

                {/* Pagination */}
                {!loader && filteredUsers.length > 0 && (
                    <div className="flex justify-between items-center mt-4 bg-gray-800 p-4 rounded-lg">
                        <div className="text-sm text-gray-400">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} users
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
            </div>
        </div>
    );
};

export default Users;
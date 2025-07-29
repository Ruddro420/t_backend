/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

const WithDrawRequests = () => {
    const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;

    const [withdrawList, setWithdrawList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [loader, setLoader] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const sendNotification = async (userId, message) => {
        try {
            await addDoc(collection(db, 'notifications'), {
                userId: userId,
                message: message,
                timestamp: serverTimestamp()
            });
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    };

    const [filters, setFilters] = useState({
        user_id: "",
        amount: "",
        phone: "",
        method: "",
        status: "",
        time: "new", // "new" or "old"
    });

    const fetchDeposits = () => {
        axios
            .get(`${VITE_SERVER_API}/get/withdraw-requests`)
            .then((res) => {
                const sorted = res.data.withdraw_requests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // New first
                setWithdrawList(sorted);
                setFilteredList(sorted);
                setLoader(false);
            })
            .catch((err) => {
                console.error(err);
                setLoader(false);
            });
    };

    useEffect(() => {
        fetchDeposits();
    }, []);

    const handleFilter = () => {
        let temp = [...withdrawList];

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            temp = temp.filter(d =>
                d.user_id?.toLowerCase().includes(term) ||
                d.user_name?.toLowerCase().includes(term) ||
                d.payment_phone_number?.toLowerCase().includes(term) ||
                d.payment_method?.toLowerCase().includes(term) ||
                d.amount?.toString().includes(term)
            );
        }

        if (filters.status !== "") {
            temp = temp.filter(d => String(d.status) === filters.status);
        }

        if (filters.time === "old") {
            temp.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        } else {
            temp.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }

        setFilteredList(temp);
        setCurrentPage(1); // Reset to first page when filters change
    };

    const resetFilters = () => {
        setSearchTerm("");
        setFilters({
            status: "",
            time: "new",
        });
        setFilteredList(withdrawList);
    };

    useEffect(() => {
        handleFilter();
    }, [filters, searchTerm]);

    const onSubmit = async (id, userid, amount, status) => {
        const request = axios.post(`${VITE_SERVER_API}/withdraw-request/${id}/${status}`);
        toast.promise(request, {
            loading: "Updating...",
            success: "Status updated successfully!",
            error: "Something went wrong!",
        });
        request
            .then(() => {
                fetchDeposits();
                sendNotification(userid, `Your withdraw request of Taka${amount} has been ${status == 1 ? "approved" : "pending"}!`);
            });
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredList.length / itemsPerPage);

    return (
        <div className="lg:p-6 py-6 space-y-6">
            <h2 className="text-2xl font-semibold text-blue-500">All Withdraw Requests</h2>

            {/* Filter Inputs */}
            <h2 className="text-xl font-semibold text-gray-200">Filter Withdraw List</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-800 p-4 rounded-lg">
                <input
                    type="text"
                    placeholder="Search user, phone, method, amount"
                    className="p-2 rounded bg-gray-800 text-white border border-gray-600 col-span-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    className="p-2 rounded bg-gray-800 text-white border border-gray-600"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                    <option value="">All Status</option>
                    <option value="0">Pending</option>
                    <option value="1">Approved</option>
                </select>

                <select
                    className="p-2 rounded bg-gray-800 text-white border border-gray-600"
                    value={filters.time}
                    onChange={(e) => setFilters({ ...filters, time: e.target.value })}
                >
                    <option value="new">New First</option>
                    <option value="old">Old First</option>
                </select>

                <button
                    onClick={resetFilters}
                    className="shadow-sm bg-blue-800 border text-white sm:text-sm rounded-lg block w-full p-2.5 cursor-pointer"
                >
                    Reset Filters
                </button>
            </div>

            {/* Table */}
            <h2 className="text-xl font-semibold text-gray-200">Withdraw List</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">User ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">User Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Payment Method</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Action</th>
                        </tr>
                    </thead>
                    {!loader ? (
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {currentItems?.map((withdraw) => (
                                <tr key={withdraw.id}>
                                    <td className="px-6 py-4 text-sm text-gray-200">{withdraw.user_id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">{withdraw.user_name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">{withdraw.payment_method}</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">{withdraw.payment_phone_number}</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">{withdraw.amount} ৳</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            withdraw.status == 1 ? 'bg-green-500' : 'bg-yellow-500'
                                        }`}>
                                            {withdraw.status == 1 ? "Approved" : "Pending"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button
                                            className={`btn ${withdraw.status == 0 ? 'bg-green-500' : 'bg-yellow-500'} text-white px-3 py-1 rounded-md`}
                                            onClick={() => onSubmit(withdraw.id, withdraw.user_id, withdraw.amount, withdraw.status == 0 ? 1 : 0)}
                                        >
                                            {withdraw.status == 0 ? "Approve" : "Set Pending"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {currentItems.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center text-gray-400 py-4">
                                        No withdraw requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    ) : (
                        <Loader />
                    )}
                </table>

                {/* Pagination Controls */}
                {!loader && filteredList.length > 0 && (
                    <div className="flex justify-between items-center mt-4 bg-gray-800 p-4 rounded-lg">
                        <div className="text-sm text-gray-400">
                            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredList.length)} of {filteredList.length} requests
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

export default WithDrawRequests;
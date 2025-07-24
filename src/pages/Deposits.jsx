/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const Deposits = () => {
    const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;

    const [depositList, setDepositList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [loader, setLoader] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

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
            .get(`${VITE_SERVER_API}/deposites`)
            .then((res) => {
                const sorted = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // New first
                setDepositList(sorted);
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
        let temp = [...depositList];

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            temp = temp.filter(d =>
                d.user_id?.toLowerCase().includes(term) ||
                d.transaction_id?.toLowerCase().includes(term) ||
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
    };


    const resetFilters = () => {
        setSearchTerm("");
        setFilters({
            status: "",
            time: "new",
        });
        setFilteredList(depositList);
    };


    useEffect(() => {
        handleFilter();
    }, [filters, searchTerm]); // <-- Add searchTerm here


    const onSubmit = async (id, status) => {
        const request = axios.post(`${VITE_SERVER_API}/deposites/${id}/${status}`);
        toast.promise(request, {
            loading: "Updating...",
            success: "Status updated successfully!",
            error: "Something went wrong!",
        });
        request
        axios.post(`${VITE_SERVER_API}/notify-user`, {
            user_id: id,
            message: `Your deposit has been ${status === 1 ? "approved" : "set to pending"}.`,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => console.log(response))
            .catch((error) => console.error("Notification error:", error));


    };

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-blue-500">All Deposits</h2>

            {/* Filter Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-800 p-4 rounded-lg">
                <input
                    type="text"
                    placeholder="Search user, transaction ID, phone, method, amount"
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
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">User ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Transaction ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Phone Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Payment Method</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Action</th>
                        </tr>
                    </thead>
                    {!loader ? (
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {filteredList?.map((deposit) => (
                                <tr key={deposit.id}>
                                    <td className="px-6 py-4 text-sm text-gray-200">{deposit.user_id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">#{deposit.transaction_id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">{deposit.payment_phone_number}</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">{deposit.payment_method}</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">{deposit.amount} ৳</td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button
                                            className={`btn ${deposit.status == 0 ? 'btn-success' : 'bg-red-500'} text-white`}
                                            onClick={() => onSubmit(deposit.id, deposit.status == 0 ? 1 : 0)}
                                        >
                                            {deposit.status == 0 ? "Approve" : "Pending"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredList.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center text-gray-400 py-4">
                                        No deposits found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    ) : (
                        <Loader />
                    )}
                </table>
            </div>
        </div>
    );
};

export default Deposits;

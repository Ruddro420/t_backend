/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const Deposits = () => {
    const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;

    const [depositList, setDepositList] = useState([]);
    const [loader, setLoader] = useState(true);

    const fetchDeposits = () => {
        axios
            .get(`${VITE_SERVER_API}/deposites`)
            .then((res) => {
                setDepositList(res.data);
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

    const onSubmit = async (id, status) => {
        console.log(id, status);
        const request = axios.post(`${VITE_SERVER_API}/deposites/${id}/${status}`)
        toast.promise(request, {
            loading: "Updating...",
            success: "Status updated successfully!",
            error: "Something went wrong!",
        });
        request
            .then(() => {
                fetchDeposits();
            })
            .catch((err) => console.error(err));
    };

    console.log(depositList);


    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-blue-500">All Deposits</h2>
            <div>

                {/* <h2 className="text-xl font-semibold text-gray-200 mt-6 py-5">Room Details List</h2> */}
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
                                {depositList?.map((deposit) => (
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
                                {depositList.length == 0 && (
                                    <tr>
                                        <td colSpan="4" className=" py-4 text-center text-gray-400 w-full">
                                            No deposits found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        ) : (<Loader />)}
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Deposits;

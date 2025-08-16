/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const Payment = () => {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [paymentList, setPaymentList] = useState([]);
    const [loader, setLoader] = useState(true);
    const [editId, setEditId] = useState(null);

    const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;

    // Fetch all payments
    const fetchPayments = () => {
        axios.get(`${VITE_SERVER_API}/payments`)
            .then(res => {
                setPaymentList(res.data);
                setLoader(false);
            })
            .catch(err => {
                console.error(err);
                setLoader(false);
            });
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    // Add or Update Payment
    const onSubmit = async (data) => {
        const payload = {
            payment_number: data.payment_number,
            payment_method: data.payment_method,
            payment_rules: data.payment_rules
        };

        const request = editId
            ? axios.put(`${VITE_SERVER_API}/payments/${editId}`, payload)
            : axios.post(`${VITE_SERVER_API}/payments`, payload);

        toast.promise(request, {
            loading: editId ? "Updating..." : "Saving...",
            success: editId ? "Payment updated!" : "Payment added!",
            error: "Something went wrong!"
        });

        request
            .then(() => {
                fetchPayments();
                reset();
                setEditId(null);
            })
            .catch(err => console.error(err));
    };

    // Delete Payment
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this payment?");
        if (!confirmDelete) return;

        toast.promise(
            axios.delete(`${VITE_SERVER_API}/payments/${id}`).then(() => fetchPayments()),
            {
                loading: "Deleting...",
                success: "Deleted successfully!",
                error: "Delete failed!"
            }
        );
    };

    // Handle Edit
    const handleEdit = (item) => {
        setEditId(item.id);
        setValue("payment_number", item.payment_number);
        setValue("payment_method", item.payment_method);
        setValue("payment_rules", item.payment_rules);
    };

    return (
        <div className="lg:p-6 py-6 space-y-6">
            <h2 className="text-2xl font-semibold text-blue-500">Payment Management</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="lg:grid md:grid flex flex-col items-stretch lg:grid-cols-3 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="payment_number" className="text-sm font-medium text-gray-200 block mb-2">
                            Payment Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="payment_number"
                            type="text"
                            {...register("payment_number", { required: true })}
                            className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5"
                            placeholder="Payment Number"
                        />
                        {errors.payment_number && <p className="text-red-500 text-xs mt-1">Payment Number is required</p>}
                    </div>

                    <div>
                        <label htmlFor="payment_method" className="text-sm font-medium text-gray-200 block mb-2">
                            Payment Method <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="payment_method"
                            type="text"
                            {...register("payment_method", { required: true })}
                            className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5"
                            placeholder="Payment Method"
                        />
                        {errors.payment_method && <p className="text-red-500 text-xs mt-1">Payment Method is required</p>}
                    </div>

                    <div>
                        <label htmlFor="payment_rules" className="text-sm font-medium text-gray-200 block mb-2">
                            Payment Rules
                        </label>
                        <textarea
                            id="payment_rules"
                            {...register("payment_rules")}
                            className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5"
                            placeholder="Payment Rules (Optional)"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="shadow-sm bg-blue-800 border text-gray-200 sm:text-sm rounded-lg block w-full p-2.5 cursor-pointer"
                        >
                            {editId ? "Update Payment" : "Add Payment"}
                        </button>
                    </div>
                </div>
            </form>

            <div className="overflow-x-auto mt-6">
                {!loader ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Payment Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Method</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Rules</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {paymentList.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-200">{item.payment_number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-200">{item.payment_method}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-200">{item.payment_rules || "-"}</td>
                                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                                        {/* <button className="btn" onClick={() => handleEdit(item)}>Edit</button> */}
                                        <button className="btn bg-red-500" onClick={() => handleDelete(item.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {paymentList.length === 0 && (
                                <tr>
                                    <td className="px-6 py-4 text-gray-400" colSpan="4">No payments found.</td>
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

export default Payment;

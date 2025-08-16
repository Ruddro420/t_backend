/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const PromoCode = () => {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [promoList, setPromoList] = useState([]);
    const [loader, setLoader] = useState(true);
    const [editId, setEditId] = useState(null);

    const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;

    // Fetch all promo codes
    const fetchPromoCodes = () => {
        axios.get(`${VITE_SERVER_API}/promo-codes`)
            .then(res => {
                setPromoList(res.data);
                setLoader(false);
            })
            .catch(err => {
                console.error(err);
                setLoader(false);
            });
    };

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    // Add / Update promo code
    const onSubmit = async (data) => {
        const payload = {
            code_name: data.code_name,
            offer_amount: parseFloat(data.offer_amount),
            valid_until: data.valid_until,
        };

        const request = editId
            ? axios.post(`${VITE_SERVER_API}/promo-codes/${editId}`, payload) // If you add edit API later
            : axios.post(`${VITE_SERVER_API}/promo-codes`, payload);

        toast.promise(request, {
            loading: editId ? "Updating..." : "Saving...",
            success: editId ? "Promo code updated!" : "Promo code added!",
            error: "Something went wrong!",
        });

        request
            .then(() => {
                fetchPromoCodes();
                reset();
                setEditId(null);
            })
            .catch(err => console.error(err));
    };

    // Delete promo code
    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this promo code?")) return;

        toast.promise(
            axios.delete(`${VITE_SERVER_API}/promo-codes/${id}`).then(() => {
                fetchPromoCodes();
            }),
            {
                loading: "Deleting...",
                success: "Deleted successfully!",
                error: "Delete failed!",
            }
        );
    };

    // Handle edit
    const handleEdit = (item) => {
        setEditId(item.id);
        setValue("code_name", item.code_name);
        setValue("offer_amount", item.offer_amount);
        setValue("valid_until", item.valid_until.split("T")[0]); // format date for input
    };

    return (
        <div className="lg:p-6 py-6 space-y-6">
            <h2 className="text-2xl font-semibold text-blue-500">Promo Codes</h2>

            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="lg:grid md:grid flex flex-col items-stretch lg:grid-cols-3 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-gray-200 block mb-2">Promo Code Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                {...register("code_name", { required: true })}
                                className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5"
                                placeholder="Enter promo code name"
                            />
                            {errors.code_name && <p className="text-red-500 text-xs mt-1">Promo code name is required</p>}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-200 block mb-2">Offer Amount <span className="text-red-500">*</span></label>
                            <input
                                type="number"
                                step="0.01"
                                {...register("offer_amount", { required: true })}
                                className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5"
                                placeholder="Enter offer amount"
                            />
                            {errors.offer_amount && <p className="text-red-500 text-xs mt-1">Offer amount is required</p>}
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-200 block mb-2">Validity Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                {...register("valid_until", { required: true })}
                                className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5"
                            />
                            {errors.valid_until && <p className="text-red-500 text-xs mt-1">Validity date is required</p>}
                        </div>

                        <div className="col-span-3">
                            <button
                                type="submit"
                                className="shadow-sm bg-blue-800 border text-gray-200 sm:text-sm rounded-lg block w-full p-2.5 cursor-pointer mt-4"
                            >
                                {editId ? "Update Promo Code" : "Add Promo Code"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="overflow-x-auto mt-6">
                {!loader ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-800 text-left">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium text-gray-200 uppercase tracking-wider">Promo Code</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-200 uppercase tracking-wider">Offer Amount</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-200 uppercase tracking-wider">Valid Until</th>
                                <th className="px-6 py-3 text-xs font-medium text-gray-200 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {promoList.map(item => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 text-gray-200">{item.code_name}</td>
                                    <td className="px-6 py-4 text-gray-200">{item.offer_amount}</td>
                                    <td className="px-6 py-4 text-gray-200">{new Date(item.valid_until).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button className="btn" onClick={() => handleEdit(item)}>Edit</button>
                                        <button className="btn bg-red-500" onClick={() => handleDelete(item.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {promoList.length === 0 && (
                                <tr>
                                    <td className="px-6 py-4 text-gray-400" colSpan="4">No promo codes found.</td>
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

export default PromoCode;

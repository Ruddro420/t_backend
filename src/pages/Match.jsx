/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const Match = () => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    const [categoryList, setCategoryList] = useState([]);
    const [matchList, setMatchList] = useState([]);
    const [loader, setLoader] = useState(true);
    const [editId, setEditId] = useState(null);

    const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;
    const VITE_FILE_API = import.meta.env.VITE_FILE_API;

    // Load categories
    const fetchCategories = () => {
        axios
            .get(`${VITE_SERVER_API}/categories`)
            .then((res) => {
                setCategoryList(res.data);
                setLoader(false);
            })
            .catch((err) => {
                console.error(err);
                setLoader(false);
            });
    };
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
        fetchCategories();
        fetchMatches();
    }, []);

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            max_player: parseInt(data.max_player),
            win_price: parseInt(data.win_price),
            kill_price: parseInt(data.kill_price),
            entry_fee: parseInt(data.entry_fee),
            total_prize: parseInt(data.total_prize),
            second_prize: parseInt(data.second_prize || 0),
            third_prize: parseInt(data.third_prize || 0),
            fourth_prize: parseInt(data.fourth_prize || 0),
            fifth_prize: parseInt(data.fifth_prize || 0),
        };

        const request = editId
            ? axios.post(`${VITE_SERVER_API}/matches/${editId}`, payload)
            : axios.post(`${VITE_SERVER_API}/add/match`, payload);

        toast.promise(request, {
            loading: editId ? "Updating..." : "Saving...",
            success: editId ? "Match updated!" : "Match added!",
            error: "Something went wrong!",
        });

        request
            .then(() => {
                fetchMatches();
                reset();
                setEditId(null);
            })
            .catch((err) => console.error(err));
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        Object.entries(item).forEach(([key, value]) => {
            if (value !== null) setValue(key, value);
        });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete?");
        if (!confirmDelete) return;

        toast.promise(
            axios.delete(`${VITE_SERVER_API}/matches/${id}`).then(() => {
                fetchMatches();
                reset();
                setEditId(null);
            }),
            {
                loading: "Deleting...",
                success: "Deleted successfully!",
                error: "Delete failed!",
            }
        );
    };

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-200">Add Match Details</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Match Details */}
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-200 block mb-2">
                            Match Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("match_name", { required: true })}
                            className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5"
                            placeholder="Enter Match Name"
                        />
                        {errors.match_name && <span className="text-red-400 text-sm">Match name is required</span>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-200 block mb-2">
                            Category Name<span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register("category_id", { required: true })}
                            className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5"
                        >
                            <option value="">Select Category</option>
                            {categoryList?.map((cat) => (
                                <option key={cat?.id} value={cat?.id}>
                                    {cat?.name}
                                </option>
                            ))}
                        </select>
                        {errors.category && <span className="text-red-400 text-sm">Category is required</span>}
                    </div>
                </div>

                {/* Game Details */}
                <h2 className="text-xl font-semibold text-gray-200 mt-6 py-4">Game Details</h2>
                <hr />
                <br />
                <div className="grid lg:grid-cols-7 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="max_player" className="text-sm font-medium text-gray-200 block mb-2">
                            Max Player
                            <span className="text-red-500">*</span>
                        </label>
                        <input {...register("max_player", { required: true })} name="max_player" id="max_player" type="number" placeholder="Max Player Entry" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5" />
                    </div>

                    <div>
                        <label htmlFor="map_name" className="text-sm font-medium text-gray-200 block mb-2">
                            Map Name<span className="text-red-500">*</span>
                        </label>
                        <input {...register("map_name", { required: true })} name="map_name" id="map_name" placeholder="Map Name" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5" />
                    </div>

                    <div>
                        <label htmlFor="version" className="text-sm font-medium text-gray-200 block mb-2">
                            Version<span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register("version", { required: true })}
                            className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5"
                        >
                            <option value="">Select Version</option>
                            <option value="Mobile">Mobile</option>
                            <option value="PC">PC</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="game_type" className="text-sm font-medium text-gray-200 block mb-2">
                            Game Type
                        </label>
                        <select
                            {...register("game_type")}
                            id="game_type"
                            name="game_type"
                            className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5"
                        >
                            <option value="">Select</option>
                            <option value="Solo">Solo</option>
                            <option value="Duo">Duo</option>
                            <option value="Squad">Squad</option>
                        </select>
                        
                    </div>

                    <div>
                        <label htmlFor="game_mood" className="text-sm font-medium text-gray-200 block mb-2">
                            Game Mood
                        </label>
                        <input {...register("game_mood")} name="game_mood" id="game_mood" placeholder="Game Mood" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5" />
                    </div>

                    <div>
                        <label htmlFor="time" className="text-sm font-medium text-gray-200 block mb-2">
                            Time<span className="text-red-500">*</span>
                        </label>
                        <input {...register("time", { required: true })} name="time" id="time" type="time" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5" />
                    </div>

                    <div>
                        <label htmlFor="date" className="text-sm font-medium text-gray-200 block mb-2">
                            Date<span className="text-red-500">*</span>
                        </label>
                        <input {...register("date", { required: true })} name="date" id="date" type="date" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5" />
                    </div>
                </div>

                {/* Winner Prize */}
                <h2 className="text-xl font-semibold text-gray-200 mt-6 py-4">Winner Prize</h2>
                <hr />
                <br />
                <div className="grid lg:grid-cols-4 gap-6">
                    <div>
                        <label htmlFor="win_price" className="text-sm font-medium text-gray-200 block mb-2">
                            Win Price<span className="text-red-500">*</span>
                        </label>
                        <input {...register("win_price", { required: true })} name="win_price" id="win_price" type="number" placeholder="Win Price" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5" />
                    </div>

                    <div>
                        <label htmlFor="kill_price" className="text-sm font-medium text-gray-200 block mb-2">
                            Per Kill Price<span className="text-red-500">*</span>
                        </label>
                        <input {...register("kill_price", { required: true })} name="kill_price" id="kill_price" type="number" placeholder="Per Kill Price" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5" />
                    </div>

                    <div>
                        <label htmlFor="entry_fee" className="text-sm font-medium text-gray-200 block mb-2">
                            Entry Fee<span className="text-red-500">*</span>
                        </label>
                        <input {...register("entry_fee", { required: true })} name="entry_fee" id="entry_fee" type="number" placeholder="Entry Fee" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5" />
                    </div>

                    <div>
                        <label htmlFor="second_prize" className="text-sm font-medium text-gray-200 block mb-2">
                            Second Prize
                        </label>
                        <input {...register("second_prize")} name="second_prize" id="second_prize" type="number" placeholder="Second Prize" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5" />
                    </div>

                    <div>
                        <label htmlFor="third_prize" className="text-sm font-medium text-gray-200 block mb-2">
                            Third Prize
                        </label>
                        <input {...register("third_prize")} name="third_prize" id="third_prize" type="number" placeholder="Third Prize" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5" />
                    </div>

                    <div>
                        <label htmlFor="fourth_prize" className="text-sm font-medium text-gray-200 block mb-2">
                            Fourth Prize
                        </label>
                        <input {...register("fourth_prize")} name="fourth_prize" id="fourth_prize" type="number" placeholder="Fourth Prize" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5" />
                    </div>

                    <div>
                        <label htmlFor="fifth_prize" className="text-sm font-medium text-gray-200 block mb-2">
                            Fifth Prize
                        </label>
                        <input {...register("fifth_prize")} name="fifth_prize" id="fifth_prize" type="number" placeholder="Fifth Prize" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5" />
                    </div>

                    <div>
                        <label htmlFor="total_prize" className="text-sm font-medium text-gray-200 block mb-2">
                            Total Prize<span className="text-red-500">*</span>
                        </label>
                        <input {...register("total_prize", { required: true })} name="total_prize" id="total_prize" type="number" placeholder="Total Prize" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5" />
                    </div>
                </div>

                {/* Submit */}
                <div className="mt-6">
                    <button type="submit" className="bg-blue-800 text-white px-4 py-2 rounded">
                        {editId ? "Update Match" : "Submit Match"}
                    </button>
                </div>
            </form>

            {/* Match List - You need to replace static row with your fetched match list */}
            <div>
                <h2 className="text-xl font-semibold text-gray-200 mt-6">Match Details List</h2>
                <br />
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
                                {matchList ? matchList.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                        <img className="w-10 h-10 rounded" src={`${VITE_FILE_API}/storage/${item.category?.image}`} alt={item.name} />
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
                                            <button className="btn" onClick={() => handleEdit(item)}>Edit</button>
                                            <button className="btn bg-red-500" onClick={() => handleDelete(item.id)}>Delete</button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-4 text-sm text-gray-200 text-center">No matches found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <Loader />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Match;

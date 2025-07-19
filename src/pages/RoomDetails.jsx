/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const RoomDetails = () => {
    const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    const [matchList, setMatchList] = useState([]);
    const [roomList, setRoomList] = useState([]);
    const [loader, setLoader] = useState(true);
    const [editId, setEditId] = useState(null);

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

    const fetchRooms = () => {
        axios
            .get(`${VITE_SERVER_API}/rooms`)
            .then((res) => setRoomList(res.data))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetchMatches();
        fetchRooms();
    }, []);

    const onSubmit = async (data) => {
        const payload = {
            match_id: data.match_id,
            room_id: data.room_id,
            room_password: data.room_password,
        };

        const request = editId
            ? axios.post(`${VITE_SERVER_API}/rooms/${editId}`, payload)
            : axios.post(`${VITE_SERVER_API}/add/room`, payload);

        toast.promise(request, {
            loading: editId ? "Updating..." : "Saving...",
            success: editId ? "Room updated!" : "Room added!",
            error: "Something went wrong!",
        });

        request
            .then(() => {
                fetchRooms();
                reset();
                setEditId(null);
            })
            .catch((err) => console.error(err));
    };

    const handleEdit = (item) => {
        setEditId(item.id);
        setValue("match_id", item.match_id);
        setValue("room_id", item.room_id);
        setValue("room_password", item.room_password);
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete?");
        if (!confirm) return;

        toast.promise(
            axios.delete(`${VITE_SERVER_API}/rooms/${id}`).then(() => {
                fetchRooms();
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
    console.log("Room List:", roomList);

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-200 mt-6 py-5">Room Details</h2>
                <hr />
                <br />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                        {/* Match ID */}
                        <div>
                            <label className="text-sm font-medium text-gray-200 block mb-2">
                                Match ID<span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register("match_id", { required: true })}
                                // disabled={!!editId}
                                className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5"
                            >
                                <option className="text-sm" value="">Select Match ID</option>
                                {matchList
                                    .filter((match) =>
                                        editId
                                            ? true
                                            : !roomList.find((room) => room.match_id === match.id)
                                    )
                                    .map((match) => (
                                        <option className="text-sm" key={match.id} value={match.id}>
                                            #{match.match_id}-{match.match_name}
                                        </option>
                                    ))}
                            </select>
                            {errors.match_id && <span className="text-red-400 text-sm">Match ID is required</span>}
                        </div>

                        {/* Room ID */}
                        <div>
                            <label className="text-sm font-medium text-gray-200 block mb-2">
                                Room ID<span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register("room_id", { required: true })}
                                className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5"
                                placeholder="Enter Room ID"
                            />
                            {errors.room_id && <span className="text-red-400 text-sm">Room ID is required</span>}
                        </div>

                        {/* Room Password */}
                        <div>
                            <label className="text-sm font-medium text-gray-200 block mb-2">
                                Room Password<span className="text-red-500">*</span>
                            </label>
                            <input
                                {...register("room_password", { required: true })}
                                className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg block w-full p-2.5"
                                placeholder="Enter Password"
                            />
                            {errors.room_password && <span className="text-red-400 text-sm">Password is required</span>}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="shadow-sm bg-blue-800 border text-white sm:text-sm rounded-lg block w-full p-2.5 cursor-pointer"
                        >
                            {editId ? "Update Room Details" : "Submit Room Details"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Room List */}
            <div>
                <h2 className="text-xl font-semibold text-gray-200 mt-6 py-5">Room Details List</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Match ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Match Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Room ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Room Password</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Action</th>
                            </tr>
                        </thead>
                        {!loader ? (
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {roomList.map((room) => (
                                    <tr key={room.id}>
                                        <td className="px-6 py-4 text-sm text-gray-200">#{room.match?.match_id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-200">{room.match.match_name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-200">{room.room_id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-200">{room.room_password}</td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <button
                                                className="btn"
                                                onClick={() => handleEdit(room)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn bg-red-500"
                                                onClick={() => handleDelete(room.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {roomList.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className=" py-4 text-center text-gray-400 w-full">
                                            No rooms found.
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

export default RoomDetails;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
const Users = () => {
    const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;

    const [userList, setUserList] = useState([]);
    const [loader, setLoader] = useState(true);

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

    const disableUser = async (uid) => {
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
    };

    console.log(userList);

    return (
        <div className="lg:p-6 py-6 space-y-6">
            <h2 className="text-2xl font-semibold text-blue-500">All Users</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">User ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">User Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200">Action</th>
                        </tr>
                    </thead>
                    {!loader ? (
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {userList?.map((user) => (
                                <tr key={user?.uid}>
                                    <td className="px-6 py-4 text-sm text-gray-200">#{user?.uid}</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">{user?.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-200">{user?.created_at}</td>
                                    <td className="px-6 py-4 flex gap-2">
                                        <button
                                            className={`btn ${user.disabled == true ? 'btn-success' : 'bg-red-500'} text-white`}
                                            onClick={() => disableUser(user.uid)}
                                        >
                                            {user.disabled == true ? "Approve" : "Disable"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {userList.length === 0 && (
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

export default Users;

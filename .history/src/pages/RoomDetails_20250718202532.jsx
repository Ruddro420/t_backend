import React from 'react';

const RoomDetails = () => {
    return (
        <>
            <div>
                <h2 className="text-xl font-semibold text-gray-200 mt-6 py-5">Room Details</h2> <hr /><br />
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-200 block mb-2">Match ID<span className="text-red-500">*</span></label>
                        <select className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" required>
                            <option value="">Select Match ID</option>
                            <option value="match1">Match #1</option>
                            <option value="match2">Match #2</option>
                            {/* Add dynamic match options here */}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-200 block mb-2">Room ID<span className="text-red-500">*</span></label>
                        <input type="text" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" placeholder="Enter Room ID" required />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-200 block mb-2">Room Password<span className="text-red-500">*</span></label>
                        <input type="text" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" placeholder="Enter Password" required />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                    <button type="submit" className="shadow-sm bg-blue-800 border text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5 cursor-pointer">
                        Submit Room Details
                    </button>
                </div>

            </div>
        /* Room Details */
            <div>
                <h2 className="text-xl font-semibold text-gray-200 mt-6">Room Details List</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Match ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Room ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Room Password</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {/* Loop your data here */}
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">Match #1</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">Room123</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">pass456</td>
                                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                                    <button className="btn">Edit</button>
                                    <button className="btn bg-red-500">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>

    );
};

export default RoomDetails;
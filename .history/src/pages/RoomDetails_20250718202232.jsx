import React from 'react';

const RoomDetails = () => {
    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-200 mt-6">Room Details</h2>
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

        </div>
    );
};

export default RoomDetails;
import React from 'react';

const Match = () => {
    return (
        <>
            <div className="p-6 space-y-6">
                <h2 className="text-2xl font-semibold text-gray-200">Add Match Details</h2>
                <form>
                    {/* Match Details */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-gray-200 block mb-2">
                                Match Name<span className="text-red-500">*</span>
                            </label>
                            <input
                                name="match_name"
                                type="text"
                                className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5"
                                placeholder="Enter Match Name"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-200 block mb-2">
                                Category Name<span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5"
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="pubg">PUBG</option>
                                <option value="freefire">Free Fire</option>
                                <option value="cod">Call of Duty</option>
                            </select>
                        </div>
                    </div>

                    {/* Game Details */}
                    <h2 className="text-xl font-semibold text-gray-200 mt-6 py-4">Game Details</h2>
                    <hr />
                    <br />
                    <div className="grid lg:grid-cols-7 gap-6 sm:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-gray-200 block mb-2">Max Player Entry<span className="text-red-500">*</span></label>
                            <input name="max_player" type="number" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" placeholder="Ex: 100" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-200 block mb-2">Map Name<span className="text-red-500">*</span></label>
                            <input name="map_name" type="text" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" placeholder="Ex: Erangel" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-200 block mb-2">Version<span className="text-red-500">*</span></label>
                            <input name="version" type="text" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" placeholder="Ex: 2.9.0" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-200 block mb-2">Game Type</label>
                            <input name="game_type" type="text" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" placeholder="Ex: Solo/Duo/Squad" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-200 block mb-2">Game Mood</label>
                            <input name="game_mood" type="text" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" placeholder="Ex: Classic" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-200 block mb-2">Time<span className="text-red-500">*</span></label>
                            <input name="time" type="time" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-200 block mb-2">Date<span className="text-red-500">*</span></label>
                            <input name="date" type="date" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" required />
                        </div>
                    </div>

                    {/* Winner Prize */}
                    <h2 className="text-xl font-semibold text-gray-200 mt-6 py-4">Winner Prize</h2>
                    <hr />
                    <br />
                    <div className="grid lg:grid-cols-4 gap-6">
                        <div>
                            <label className="text-sm font-medium text-gray-200 block mb-2">Win Price<span className="text-red-500">*</span></label>
                            <input name="win_price" type="number" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" placeholder="Ex: 500" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-200 block mb-2">Per Kill Price<span className="text-red-500">*</span></label>
                            <input name="kill_price" type="number" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" placeholder="Ex: 10" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-200 block mb-2">Entry Fee<span className="text-red-500">*</span></label>
                            <input name="entry_fee" type="number" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" placeholder="Ex: 20" required />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-200 block mb-2">Second Prize</label>
                            <input name="second_prize" type="number" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-200 block mb-2">Third Prize</label>
                            <input name="third_prize" type="number" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-200 block mb-2">Fourth Prize</label>
                            <input name="fourth_prize" type="number" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-200 block mb-2">Fifth Prize</label>
                            <input name="fifth_prize" type="number" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-200 block mb-2">Total Prize<span className="text-red-500">*</span></label>
                            <input name="total_prize" type="number" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" placeholder="Ex: 1000" required />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-6">
                        <button type="submit" className="shadow-sm bg-blue-800 border text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5 cursor-pointer">
                            Submit Match
                        </button>
                    </div>
                </form>
            </div>

            {/* Match Details */}
            <div>
                <h2 className="text-xl font-semibold text-gray-200 mt-6">Match Details List</h2> <br />
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Match Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Max Players</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Map</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Version</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Total Prize</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {/* Replace this with dynamic rows using map */}
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">Battle Royale</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">Free Fire</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">100</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">Bermuda</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">3.0.1</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">2025-07-25</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">15:00</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">৳1000</td>
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

export default Match;
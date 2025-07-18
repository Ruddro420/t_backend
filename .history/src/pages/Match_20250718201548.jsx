import React from 'react';

const Match = () => {
    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-200">Add Match Details</h2>
            <form>
                {/* Match Details */}
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-200 block mb-2">Match Name<span className="text-red-500">*</span></label>
                        <input type="text" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" placeholder="Enter Match Name" required />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-200 block mb-2">Category Name<span className="text-red-500">*</span></label>
                        <select className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" required>
                            <option value="">Select Category</option>
                            <option value="pubg">PUBG</option>
                            <option value="freefire">Free Fire</option>
                            <option value="cod">Call of Duty</option>
                        </select>
                    </div>
                </div>

                {/* Game Details */}
                <h2 className="text-xl font-semibold text-gray-200 mt-6">Game Details</h2>
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-200 block mb-2">Max Player Entry<span className="text-red-500">*</span></label>
                        <input type="number" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" placeholder="Ex: 100" required />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-200 block mb-2">Map Name<span className="text-red-500">*</span></label>
                        <input type="text" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" placeholder="Ex: Erangel" required />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-200 block mb-2">Version<span className="text-red-500">*</span></label>
                        <input type="text" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" placeholder="Ex: 2.9.0" required />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-200 block mb-2">Game Type</label>
                        <input type="text" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" placeholder="Ex: Solo/Duo/Squad" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-200 block mb-2">Game Mood</label>
                        <input type="text" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" placeholder="Ex: Classic" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-200 block mb-2">Time<span className="text-red-500">*</span></label>
                        <input type="time" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" required />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-200 block mb-2">Date<span className="text-red-500">*</span></label>
                        <input type="date" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" required />
                    </div>
                </div>

                {/* Winner Prize */}
                <h2 className="text-xl font-semibold text-gray-200 mt-6">Winner Prize</h2>
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <label className="text-sm font-medium text-gray-200 block mb-2">Win Price<span className="text-red-500">*</span></label>
                        <input type="number" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" placeholder="Ex: 500" required />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-200 block mb-2">Per Kill Price<span className="text-red-500">*</span></label>
                        <input type="number" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" placeholder="Ex: 10" required />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-200 block mb-2">Entry Fee<span className="text-red-500">*</span></label>
                        <input type="number" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" placeholder="Ex: 20" required />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-200 block mb-2">Second Prize</label>
                        <input type="number" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-200 block mb-2">Third Prize</label>
                        <input type="number" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-200 block mb-2">Fourth Prize</label>
                        <input type="number" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-200 block mb-2">Fifth Prize</label>
                        <input type="number" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-200 block mb-2">Total Prize<span className="text-red-500">*</span></label>
                        <input type="number" className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5" placeholder="Ex: 1000" required />
                    </div>
                </div>

                <div className="mt-6">
                    <button type="submit" className="shadow-sm bg-blue-800 border text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5 cursor-pointer">Submit Match</button>
                </div>
            </form>
        </div>

    );
};

export default Match;
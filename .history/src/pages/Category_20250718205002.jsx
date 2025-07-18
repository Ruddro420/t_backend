import React from 'react';

const Category = () => {
    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-gray-200">Category</h2>
                <form>
                    <div className="grid grid-cols-3 items-end gap-6">
                        {/* Category Name */}
                        <div>
                            <label htmlFor="category_name" className="text-sm font-medium text-gray-200 block mb-2">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5"
                                type="text"
                                id="category_name"
                                name="category_name"
                                placeholder="Category name"
                                required
                            />
                        </div>

                        {/* Category Image */}
                        <div>
                            <label htmlFor="category_image" className="text-sm font-medium text-gray-200 block mb-2">
                                Upload Category Image <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5"
                                type="file"
                                id="category_image"
                                name="category_image"
                                accept="image/*"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="shadow-sm bg-blue-800 border text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5 cursor-pointer"
                            >
                                Add Category
                            </button>
                        </div>
                    </div>
                </form>
            </div>


            {/* Displpay Section */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        <tr >
                            <td className="px-6 py-4 whitespace-nowrap">Category</td>
                            <td className="px-6 py-4 whitespace-nowrap">22/05/2025</td>
                            {/* <td className="px-6 py-4 whitespace-nowrap">{item.description}</td> */}
                            <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                                <button className='btn'>Edit</button>
                                <button className='btn bg-red-500'>Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default Category;
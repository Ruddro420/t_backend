import React from 'react';

const Category = () => {
    return (
        <div className="p-6 space-y-6">

            <h2 className="text-2xl font-semibold text-gray-200">Skills</h2>
            <form>
                <div className="grid grid-cols-3 gap-6">
                    <div className="">
                        <label htmlFor="name" >Skill</label>
                        <input className='shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5' type="text" id="name" placeholder="Category name" />
                    </div>
                    <div className="">
                        <label htmlFor="name" >Upload Category Image</label>
                        <input className='shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5' type="file" id="name" placeholder="Category name" />
                    </div>

                    <div className="">
                        <button className='shadow-sm bg-blue-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5' type='submit'> Add Category</button>

                    </div>

                </div>
            </form>
            <div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Skill</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Skill Level</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">

                            <tr >
                                <td className="px-6 py-4 whitespace-nowrap"></td>
                                <td className="px-6 py-4 whitespace-nowrap"></td>

                                {/* <td className="px-6 py-4 whitespace-nowrap">{item.description}</td> */}
                                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                                    <button className='btn'>Edit</button>
                                    <button className='btn bg-red-500'>Delete</button>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};

export default Category;
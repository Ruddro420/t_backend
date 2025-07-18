import React from 'react';

const Category = () => {
    return (
        <div className="p-6 space-y-6">

            <h2 className="text-2xl font-semibold text-gray-200">Skills</h2>
            <form>
                <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="name" >Skill</label>
                        <input className='' type="text" id="name" placeholder="Category name" />
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="name" >Upload Category Image</label>
                        <input type="file" id="name" placeholder="Category name" />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                        <button type='submit'> Add Category</button>

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
                                    <button className='btn' /* onClick={() => {
                                                    setEditId(item._id);
                                                    for (const key in item) {
                                                        if (key in item) setValue(key, item[key]);
                                                    }
                                                }} */>
                                        Edit</button>
                                    <button className='btn bg-red-500'
                                    // onClick={() => {
                                    //     alert("Are you sure you want to delete this skill?");

                                    //     toast.promise(
                                    //         axios
                                    //             .delete(`${VITE_SERVER_API}/skill/${item._id}`)
                                    //             .then(() => {
                                    //                 updateData();
                                    //             }),
                                    //         {
                                    //             loading: "Deleting...",
                                    //             success: "Deleted successfully!",
                                    //             error: "Error deleting skill",
                                    //         }
                                    //     );
                                    // }}
                                    >Delete</button>
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
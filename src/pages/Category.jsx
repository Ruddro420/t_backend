/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { RichTextEditor } from '@mantine/rte';
const Category = () => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: { errors },
    } = useForm();

    const [categoryList, setCategoryList] = useState([]);
    const [loader, setLoader] = useState(true);
    const [editId, setEditId] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [rules, setRules] = useState("");

    const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;
    const VITE_FILE_API = import.meta.env.VITE_FILE_API;

    // Load all categories
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

    useEffect(() => {
        fetchCategories();
    }, []);

    // Add or Update Category
    const onSubmit = async (data) => {
        // console.log("Form Data:", data);
        setRules(data.rules);
        const formData = new FormData();
        formData.append("category_name", data.category_name);
        // Ensure rules is always a string
        formData.append("rules", typeof data.rules === "string" ? data.rules : String(data.rules));
        console.log("form data", formData);
        // Only append image if a new one was selected
        if (data.category_image && data.category_image.length > 0) {
            formData.append("category_image", data.category_image[0]);
        }
        // Debug: log the actual value of rules
        console.log("rules value:", data.rules);
        const request = editId
            ? axios.post(`${VITE_SERVER_API}/categories/${editId}`, formData)
            : axios.post(`${VITE_SERVER_API}/add/categories`, formData);


        toast.promise(request, {
            loading: editId ? "Updating..." : "Saving...",
            success: editId ? "Category updated!" : "Category added!",
            error: "Something went wrong!",
        });

        request
            .then(() => {
                fetchCategories();
                reset();
                setEditId(null);
                setPreviewImage(null);
            })
            .catch((err) => console.error(err));
    };

    // Delete Category
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete?");
        if (!confirmDelete) return;

        toast.promise(
            axios.delete(`${VITE_SERVER_API}/categories/${id}`).then(() => {
                fetchCategories();
            }),
            {
                loading: "Deleting...",
                success: "Deleted successfully!",
                error: "Delete failed!",
            }
        );
    };

    // Handle Edit
    const handleEdit = (item) => {
        setEditId(item.id);
        setValue("category_name", item.name);
        setValue("rules", item.rules);
        setPreviewImage(`${VITE_FILE_API}/${item.image}`);
    };

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-blue-500">Category</h2>
            <div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 items-end gap-6">
                        <div>
                            <label htmlFor="category_name" className="text-sm font-medium text-gray-200 block mb-2">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="category_name"
                                type="text"
                                {...register("category_name", { required: true })}
                                className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5"
                                placeholder="Category name"
                            />
                            {errors.category_name && <p className="text-red-500 text-xs mt-1">Name is required</p>}
                        </div>

                        <div>
                            <label htmlFor="category_image" className="text-sm font-medium text-gray-200 block mb-2">
                                Upload Category Image <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="category_image"
                                type="file"
                                {...register("category_image", { required: !editId })}
                                accept="image/*"
                                className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5"
                            />

                            {errors.category_image && <p className="text-red-500 text-xs mt-1">Image is required</p>}
                        </div>
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="w-16 h-16 rounded mt-2 border border-gray-600"
                            />
                        )}
                        <div className="col-span-6">
                            <label htmlFor="ex1" className="text-sm font-medium text-gray-200 block mb-2">Blog Content</label>
                            {/* <textarea id="blogContent" rows="6" {...register("blogContent", { required: true })} className={classList.textarea} placeholder="Describe your Blog..." /> */}
                            <Controller
                                name="rules"
                                {...register("rules", { required: true })}
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <RichTextEditor {...field} className="bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-4" />
                                )}
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="shadow-sm bg-blue-800 border text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5 cursor-pointer"
                            >
                                {editId ? "Update Category" : "Add Category"}
                            </button>
                        </div>

                    </div>
                </form>
            </div>

            <div className="overflow-x-auto">
                {!loader ? (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {categoryList.map((item) => (
                                <tr key={item._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img className="w-10 h-10 rounded" src={`${VITE_FILE_API}/${item.image}`} alt={item.name} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-200">{item.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-200">{new Date(item.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                                        <button className="btn" onClick={() => handleEdit(item)}>Edit</button>
                                        <button className="btn bg-red-500" onClick={() => handleDelete(item.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {categoryList.length === 0 && (
                                <tr>
                                    <td className="px-6 py-4 text-gray-400" colSpan="4">No categories found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                ) : (
                    <Loader />
                )}
            </div>
        </div>
    );
};

export default Category;

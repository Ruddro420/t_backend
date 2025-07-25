/* eslint-disable no-unused-vars */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const Settings = () => {
    const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm();
    const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;
    const VITE_FILE_API = import.meta.env.VITE_FILE_API;
    const [settingsData, setSettingsData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [previewLogo, setPreviewLogo] = useState(null);
    const [previewBanner_1, setPreviewBanner_1] = useState(null);
    const [previewBanner_2, setPreviewBanner_2] = useState(null);
    const [previewBanner_3, setPreviewBanner_3] = useState(null);


    useEffect(() => {

        axios.get(`${VITE_SERVER_API}/settings`)
            .then(function (response) {
                setSettingsData(response.data);
                setLoading(false);
                console.log(response.data);
            })
            .catch(function (error) {
                setLoading(false);
                console.log(error);
            })

    }, [VITE_SERVER_API]);

    useEffect(() => {
        /* Check info Data */

        if (settingsData.length > 0) {
            setEditId(settingsData[0]?.id);
            for (const key in settingsData[0]) {
                if (key in settingsData[0]) setValue(key, settingsData[0][key]);
            }
            // Set logo preview if image exists
            settingsData[0]?.app_logo ? setPreviewLogo(`${VITE_FILE_API}/${settingsData[0].app_logo}`) : setPreviewLogo(null);
            // Set banner previews if images exist
            settingsData[0]?.banner_1 ? setPreviewBanner_1(`${VITE_FILE_API}/${settingsData[0].banner_1}`) : setPreviewBanner_1(null);
            settingsData[0]?.banner_2 ? setPreviewBanner_2(`${VITE_FILE_API}/${settingsData[0].banner_2}`) : setPreviewBanner_2(null);
            settingsData[0]?.banner_3 ? setPreviewBanner_3(`${VITE_FILE_API}/${settingsData[0].banner_3}`) : setPreviewBanner_3(null);
        }
    }, [VITE_FILE_API, settingsData, setValue]);

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append('notice', data.notice);
        formData.append('app_name', data.app_name);
        // Only append logo if a new one was selected
        (data.app_logo && data.app_logo.length > 0) && formData.append('app_logo', data.app_logo[0]);
        // Only append banners if new ones were selected
        (data.banner_1 && data.banner_1.length > 0) && formData.append('banner_1', data.banner_1[0]);
        (data.banner_2 && data.banner_2.length > 0) && formData.append('banner_2', data.banner_2[0]);
        (data.banner_3 && data.banner_3.length > 0) && formData.append('banner_3', data.banner_3[0]);

        const request = editId
            ? axios.post(`${VITE_SERVER_API}/settings/${editId}`, formData)
            : axios.post(`${VITE_SERVER_API}/add/settings`, formData);

        toast.promise(request, {
            loading: editId ? 'Updating info...' : 'Saving info...',
            success: editId ? 'Info updated!' : 'Info saved!',
            error: 'Something went wrong!',
        });

        request.then(() => {
            setEditId(null);  // Clear edit state
            reset();          // Clear form           
            setPreviewLogo(null);
            setPreviewBanner_1(null);
            setPreviewBanner_2(null);
            setPreviewBanner_3(null);
            axios.get(`${VITE_SERVER_API}/settings`).then(res => {
                setSettingsData(res.data);
            });
        }).catch((error) => {
            console.error(error);
        });
    };




    const classList = {
        "label": "text-sm font-medium text-gray-200 block mb-2",
        "input": "shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5",
        "button": "shadow-sm bg-blue-800 border text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5 cursor-pointer",
        "textarea": "bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-4",
    };

    return (
        <div className="lg:p-6 py-6 space-y-6">
            <h2 className="text-2xl font-semibold text-blue-500">App Settings</h2>
            {loading ? <Loader /> : (<>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid lg:grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="app_name" className={classList.label}>Name</label>
                            <input type="text" id="app_name" {...register("app_name", { required: true })} className={classList.input} placeholder="Enter Site Title" />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="notice" className={classList.label}>Notice</label>
                            <input type="text" id="notice" {...register("notice", { required: true })} className={classList.input} placeholder="Enter Notice" />
                        </div>
                        <div className=' flex lg:grid grid-cols-4 md:grid  flex-col col-span-6 gap-6 w-full'>
                            <div>
                                <label htmlFor="app_logo" className="text-sm font-medium text-gray-200 block mb-2">
                                    Upload Logo Image <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="app_logo"
                                    name="app_logo"
                                    type="file"
                                    {...register("app_logo", { required: !editId })}
                                    accept="image/*"
                                    className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5"
                                    onChange={e => {
                                        if (e.target.files && e.target.files[0]) {
                                            setPreviewLogo(URL.createObjectURL(e.target.files[0]));
                                        } else {
                                            setPreviewLogo(null);
                                        }
                                    }}
                                />
                                {errors.app_logo && <p className="text-red-500 text-xs mt-1">Image is required</p>}
                                {previewLogo && (
                                    <img src={previewLogo} alt="Logo Preview" className="w-16 h-16 rounded mt-2 border border-gray-600" />
                                )}
                            </div>
                            <div>
                                <label htmlFor="banner_1" className="text-sm font-medium text-gray-200 block mb-2">
                                    Upload Banner 1 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="banner_1"
                                    name="banner_1"
                                    type="file"
                                    {...register("banner_1", { required: !editId })}
                                    accept="image/*"
                                    className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5"
                                    onChange={e => {
                                        if (e.target.files && e.target.files[0]) {
                                            setPreviewBanner_1(URL.createObjectURL(e.target.files[0]));
                                        } else {
                                            setPreviewBanner_1(null);
                                        }
                                    }}
                                />
                                {errors.banner_1 && <p className="text-red-500 text-xs mt-1">Image is required</p>}
                                {previewBanner_1 && (
                                    <img src={previewBanner_1} alt="Banner_1 Preview" className="w-16 h-16 rounded mt-2 border border-gray-600" />
                                )}
                            </div>
                            <div>
                                <label htmlFor="banner_2" className="text-sm font-medium text-gray-200 block mb-2">
                                    Upload Banner 2 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="banner_2"
                                    name="banner_2"
                                    type="file"
                                    {...register("banner_2", { required: !editId })}
                                    accept="image/*"
                                    className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5"
                                    onChange={e => {
                                        if (e.target.files && e.target.files[0]) {
                                            setPreviewBanner_2(URL.createObjectURL(e.target.files[0]));
                                        } else {
                                            setPreviewBanner_2(null);
                                        }
                                    }}
                                />
                                {errors.banner_2 && <p className="text-red-500 text-xs mt-1">Image is required</p>}
                                {previewBanner_2 && (
                                    <img src={previewBanner_2} alt="Banner_2 Preview" className="w-16 h-16 rounded mt-2 border border-gray-600" />
                                )}
                            </div>
                            <div>
                                <label htmlFor="banner_3" className="text-sm font-medium text-gray-200 block mb-2">
                                    Upload Banner 3 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="banner_3"
                                    name="banner_3"
                                    type="file"
                                    {...register("banner_3", { required: !editId })}
                                    accept="image/*"
                                    className="shadow-sm bg-gray-800 border border-gray-700 text-gray-200 sm:text-sm rounded-lg focus:ring-blue-900 focus:border-blue-900 block w-full p-2.5"
                                    onChange={e => {
                                        if (e.target.files && e.target.files[0]) {
                                            setPreviewBanner_3(URL.createObjectURL(e.target.files[0]));
                                        } else {
                                            setPreviewBanner_3(null);
                                        }
                                    }}
                                />
                                {errors.banner_3 && <p className="text-red-500 text-xs mt-1">Image is required</p>}
                                {previewBanner_3 && (
                                    <img src={previewBanner_3} alt="Banner_3 Preview" className="w-16 h-16 rounded mt-2 border border-gray-600" />
                                )}
                            </div>
                        </div>


                        <div className="col-span-6 sm:col-span-3">
                            <div className={`${classList.label} text-transparent`}> Submit{" "}</div>
                            <button className="shadow-sm bg-blue-800 border text-white sm:text-sm rounded-lg block w-full p-2.5 cursor-pointer" type="submit">
                                {editId ? 'Update' : 'Submit'}
                            </button>
                        </div>

                        {editId && (
                            <div className="col-span-6 sm:col-span-3">
                                <div className={`${classList.label} text-transparent`}> Submit{" "}</div>
                                <button className={`${classList.button} btn bg-red-500`}
                                    type="button"
                                    onClick={() => {
                                        if (window.confirm("Are you sure you want to delete this module?")) {
                                            toast.promise(
                                                axios
                                                    .delete(`${VITE_SERVER_API}/settings/${settingsData[0].id}`)
                                                    .then(() => {
                                                        setSettingsData([]);
                                                        setPreviewLogo(null);
                                                    }),
                                                {
                                                    loading: "Deleting...",
                                                    success: "Deleted successfully!",
                                                    error: "Error deleting module",
                                                }
                                            );
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </>)}
        </div>
    );
};

export default Settings;

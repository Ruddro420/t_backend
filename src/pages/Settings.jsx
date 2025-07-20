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
            if (settingsData[0]?.site_logo) {
                setPreviewLogo(`${VITE_FILE_API}/${settingsData[0].site_logo}`);
            } else {
                setPreviewLogo(null);
            }
        }
    }, [VITE_FILE_API, settingsData, setValue]);

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append('site_title', data.site_title);
        // Only append logo if a new one was selected
        if (data.site_logo && data.site_logo.length > 0) {
            formData.append('site_logo', data.site_logo[0]);
        }
        const request = editId
            ? axios.post(`${VITE_SERVER_API}/settings/${editId}`, formData)
            : axios.post(`${VITE_SERVER_API}/settings`, formData);

        toast.promise(request, {
            loading: editId ? 'Updating info...' : 'Saving info...',
            success: editId ? 'Info updated!' : 'Info saved!',
            error: 'Something went wrong!',
        });

        request.then(() => {
            setEditId(null);  // Clear edit state
            reset();          // Clear form           
            setPreviewLogo(null);
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
        <div className="p-6 space-y-6">
            {loading ? <Loader /> : (<>
                <h2 className="text-2xl font-semibold text-gray-200">App Settings</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="site_title" className={classList.label}>Name</label>
                            <input type="text" id="site_title" {...register("site_title", { required: true })} className={classList.input} placeholder="Enter Site Title" />
                        </div>
                        <div>
                            <label htmlFor="site_logo" className="text-sm font-medium text-gray-200 block mb-2">
                                Upload Logo Image <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="site_logo"
                                name="site_logo"
                                type="file"
                                {...register("site_logo", { required: !editId })}
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
                            {errors.site_logo && <p className="text-red-500 text-xs mt-1">Image is required</p>}
                            {previewLogo && (
                                <img src={previewLogo} alt="Logo Preview" className="w-16 h-16 rounded mt-2 border border-gray-600" />
                            )}
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                            <div className={`${classList.label} text-transparent`}> Submit{" "}</div>
                            <button className={`${classList.button} btn`} type="submit">
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

/* eslint-disable no-unused-vars */
import React, {  useState } from 'react';
import { FaTools } from 'react-icons/fa';
import { GiSkills } from 'react-icons/gi';
import { MdWork, MdWorkHistory } from 'react-icons/md';
import Loader from '../components/Loader';

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const VITE_SERVER_API = import.meta.env.VITE_SERVER_API;

   
    return (
        <div className='p-6 space-y-6'>
            {loading ? <Loader /> : (

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    <div className='border border-gray-500 flex flex-col gap-4 rounded-lg p-6'>
                        <div className="title text-md font-bold flex gap-2 items-center"><MdWork />Total Experience</div>
                        <div className="data">20</div>
                    </div>
                    <div className='border border-gray-500 flex flex-col gap-4 rounded-lg p-6'>
                        <div className="title text-md font-bold flex gap-2 items-center"> <MdWorkHistory />Total Projects</div>
                        <div className="data">10</div>
                    </div>
                    <div className='border border-gray-500 flex flex-col gap-4 rounded-lg p-6'>
                        <div className="title text-md font-bold flex gap-2 items-center"><GiSkills />Total Skills</div>
                        <div className="data">15</div>
                    </div>
                    <div className='border border-gray-500 flex flex-col gap-4 rounded-lg p-6'>
                        <div className="title text-md font-bold flex gap-2 items-center"><FaTools />Total Technologies</div>
                        <div className="data">9</div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default Dashboard;
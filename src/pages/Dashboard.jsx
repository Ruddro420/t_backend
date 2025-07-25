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
        <div className='lg:p-6 py-6 space-y-6'>
            {loading ? <Loader /> : (

                <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                    <div className='border border-gray-500 flex flex-col gap-4 rounded-lg lg:p-6 p-4'>
                        <div className="title text-md lg:font-bold font-semibold flex gap-2 items-center"> <MdWorkHistory />Total Category</div>
                        <div className="data">10</div>
                    </div>
                    <div className='border border-gray-500 flex flex-col gap-4 rounded-lg lg:p-6 p-4'>
                        <div className="title text-md lg:font-bold font-semibold flex gap-2 items-center"><MdWork />Total Match</div>
                        <div className="data">20</div>
                    </div>
                    <div className='border border-gray-500 flex flex-col gap-4 rounded-lg lg:p-6 p-4'>
                        <div className="title text-md lg:font-bold font-semibold flex gap-2 items-center"><FaTools />Pending Match</div>
                        <div className="data">9</div>
                    </div>
                    
                    <div className='border border-gray-500 flex flex-col gap-4 rounded-lg lg:p-6 p-4'>
                        <div className="title text-md lg:font-bold font-semibold flex gap-2 items-center"><GiSkills />Total Deposits</div>
                        <div className="data">15</div>
                    </div>
                    <div className='border border-gray-500 flex flex-col gap-4 rounded-lg lg:p-6 p-4'>
                        <div className="title text-md lg:font-bold font-semibold flex gap-2 items-center"><FaTools />Total Withdraw</div>
                        <div className="data">9</div>
                    </div>
                    <div className='border border-gray-500 flex flex-col gap-4 rounded-lg lg:p-6 p-4'>
                        <div className="title text-md lg:font-bold font-semibold flex gap-2 items-center"><FaTools />Net Balance</div>
                        <div className="data">9</div>
                    </div>
                    

                </div>
            )}
        </div>
    );
};

export default Dashboard;
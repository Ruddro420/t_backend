import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const RefundButton = ({ matchId }) => {
    const [loading, setLoading] = useState(false);
    // const [message, setMessage] = useState('');

    const handleRefund = async () => {
        setLoading(true);
        // setMessage('');
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_API}/match/${matchId}/refund`
            );
            toast.success(response.data.message);
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Refund failed. Try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button 
                onClick={handleRefund} 
                disabled={loading}
                style={{ padding: '8px 16px', background: 'red', color: 'white', border: 'none', cursor:'pointer', borderRadius: 4 }}
            >
                {loading ? 'Processing..' : 'Refund'}
            </button>
            {/* {message && <p>{message}</p>} */}
        </div>
    );
};

export default RefundButton;
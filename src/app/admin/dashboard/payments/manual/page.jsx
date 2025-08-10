'use client';

import React, { useState, useEffect } from 'react';
import {
    Plus,
    Edit2,
    Trash2,
    Search,
    Filter,
    Eye,
    EyeOff,
    Globe,
    Users,
    Play,
    X,
    Save,
    Loader2,
    ArrowRight,
    DollarSign,
    Check,
    CheckCircle,
    ArrowLeft
} from 'lucide-react';
import { getCookie } from 'cookies-next';
import toast from 'react-hot-toast';
import Link from 'next/link';

const ManualPaymentManagement = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total_records: 0,
        per_page: 20
    });
    const handleOpenApproveModal = (payment) => {
        setSelectedPayment(payment._id);
        setShowApproveModal(true);
    }


    const [formData, setFormData] = useState({
        months: 1,
        is_online: false
    });

    // Fetch payments from API
    const fetchPayments = async (page = 1, category = '', quality = '', limit = 20) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                status: selectedStatus || '',
                limit: limit.toString()
            });


            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/subscription/admin/all-manual-payments?${params}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${getCookie('token') || ''}`
                }
            });
            const data = await response.json();

            if (data.success) {
                setPayments(data?.data?.manualPayments);
                setPagination(data?.data?.pagination);
            } else {
                console.error('Failed to fetch payments:', data.message);
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    // Refetch when filters change
    useEffect(() => {
        fetchPayments(1, null, selectedStatus);
    }, [selectedCategory, selectedStatus]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };


    const handleApproveManualPayment = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/subscription/admin/approve-manual-payment`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${getCookie('token') || ''}`
                },
                body: JSON.stringify({
                    paymentId : selectedPayment,
                    months: formData.months
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Payment approved successfully!');
                setShowApproveModal(false);
                fetchPayments(pagination.current_page, null, selectedStatus);
            } else {
                toast.error(data.message || 'Failed to approve payment');
            }
        } catch (error) {
            console.error('Error approving payment:', error);
            toast.error('Failed to approve payment. Please try again.');
        }
    };




    const handleDeleteChannel = async (paymentId) => {
        if (window.confirm('Are you sure you want to delete this payment?')) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment/${paymentId}`, {
                    method: 'DELETE',
                });

                const data = await response.json();

                if (data.success) {
                    // Refresh the payments list
                    fetchPayments(pagination.current_page,
                        null,
                        selectedStatus
                    );
                } else {
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                console.error('Error deleting payment:', error);
                alert('Failed to delete payment. Please try again.');
            }
        }
    };



    const filteredPayments = payments.filter(payment => {
        const matchesSearch = payment.senderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||

            payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) || payment.amount.toString().includes(searchTerm);
        return matchesSearch;
    });

    // Handle pagination
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.total_pages) {
            fetchPayments(newPage, null, selectedStatus);
        }
    };

    // Handle search
    const handleSearch = () => {

        fetchPayments(1, null, selectedStatus);
    };

    const toggleChannelStatus = async (paymentId) => {
        try {
            const payment = payments.find(ch => ch._id === paymentId);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment/${paymentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    is_online: !payment.is_online
                })
            });

            const data = await response.json();

            if (data.success) {
                setPayments(prev => prev.map(ch =>
                    ch._id === paymentId ? { ...ch, is_online: !ch.is_online } : ch
                ));
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error updating payment status:', error);
            alert('Failed to update payment status. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-6 mx-auto">
            {/* Header */}
            <div className=" mb-6">
                <div>

                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Manual Payments</h1>
                            <p className="text-gray-600 mt-1">Manage users manual payments.</p>
                        </div>
                        <Link
                            href="/admin/dashboard/payments"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back All Payments
                        </Link>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                        <div className="flex justify-between flex-wrap gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search payments..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>



                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Payment Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                                <option value="cancelled">Cancelled</option>
                            </select>

                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Payments</p>
                                    <p className="text-2xl font-bold text-gray-900">{pagination.total_records}</p>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Succesfull</p>
                                    <p className="text-2xl font-bold text-green-600">{payments.filter(ch => ch.is_online).length}</p>
                                </div>
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <Eye className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Cancel</p>
                                    <p className="text-2xl font-bold text-purple-600">{payments.filter(ch => ch.is_premium).length}</p>
                                </div>
                                <div className="bg-purple-100 p-3 rounded-lg">
                                    <Globe className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Refund</p>
                                    <p className="text-2xl font-bold text-orange-600">{payments.reduce((sum, ch) => sum + (ch.viewer_count || 0), 0)}</p>
                                </div>
                                <div className="bg-orange-100 p-3 rounded-lg">
                                    <Users className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payments Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 ">
                        <div className="overflow-auto  min-w-full">
                            <table className="w-full ">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            SID
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Phone Number
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>

                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            TrxID
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Month
                                        </th>

                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Payment Method
                                        </th>
                                        <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredPayments.map((payment) => (
                                        <tr key={payment._id} className="hover:bg-gray-50">

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {payment?.user_id?.email || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {payment?.user_id?.sid || 'N/A'}
                                            </td>


                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {payment?.senderNumber || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {payment?.amount || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {payment?.transaction_id || 'N/A'}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {payment?.months || 'N/A'}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {payment?.payment_status || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {payment?.payment_method || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenApproveModal(payment)}
                                                        title='Approve Payment'
                                                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteChannel(payment._id)}
                                                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="bg-white px-6 py-3 border-t border-gray-200 sm:px-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => handlePageChange(pagination.current_page - 1)}
                                        disabled={pagination.current_page <= 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(pagination.current_page + 1)}
                                        disabled={pagination.current_page >= pagination.total_pages}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing{' '}
                                            {console.log(pagination)}
                                            <span className="font-medium">{((pagination.current_page - 1) * pagination.per_page) + 1}</span>
                                            {' '}to{' '}
                                            <span className="font-medium">
                                                {Math.min(pagination.current_page * pagination.per_page, pagination.total_records)}
                                            </span>
                                            {' '}of{' '}
                                            <span className="font-medium">{pagination.total_records}</span>
                                            {' '}results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => handlePageChange(pagination.current_page - 1)}
                                                disabled={pagination.current_page <= 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Previous
                                            </button>

                                            {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === pagination.current_page
                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => handlePageChange(pagination.current_page + 1)}
                                                disabled={pagination.current_page >= pagination.total_pages}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Approve Payment Modal */}
                    {
                        showApproveModal && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold">Approve Payment</h2>
                                        <button onClick={() => setShowApproveModal(false)} className="text-gray-500 hover:text-gray-700">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                    <p>Are you sure you want to approve this payment?</p>

                                    <div>
                                        <label className="block mt-4 text-sm font-medium text-gray-700">
                                            Select Month

                                        </label>
                                        <input
                                            type="number"
                                            name="months"
                                            id="months"
                                            placeholder="Enter number of months"
                                            value={formData.months}
                                            onChange={handleInputChange}
                                            className="mt-1 py-3 px-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            min="1"
                                            required
                                        />
                                    </div>

                                    <div className='my-6'>
                                        <label className='inline-flex items-center text-sm text-black'>
                                            <input
                                                type='checkbox'
                                                required
                                                name='terms'
                                                id='terms'
                                                checked={formData.terms || false}
                                                onChange={handleInputChange}
                                                className='form-checkbox h-5 w-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500 cursor-pointer'
                                            />
                                            <span className='ml-3 cursor-pointer select-none'>
                                                I confirm that I want to approve this payment
                                            </span>
                                        </label>
                                    </div>
                                    <div className="mt-4 flex justify-end space-x-2">
                                        <button
                                            onClick={() => setShowApproveModal(false)}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleApproveManualPayment}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Approve
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};
export default ManualPaymentManagement;
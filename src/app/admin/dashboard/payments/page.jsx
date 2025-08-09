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
    DollarSign
} from 'lucide-react';
import { getCookie } from 'cookies-next';
import toast from 'react-hot-toast';
import Link from 'next/link';

const PaymentManagement = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedQuality, setSelectedQuality] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [currentChannel, setCurrentChannel] = useState(null);
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total_records: 0,
        per_page: 20
    });

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category_id: '',
        streaming_url: '',
        m3u8_url: '',
        thumbnail: '',
        logo: '',
        is_premium: false,
        is_online: true,
        quality: 'HD',
        language: 'English',
        country: 'International',
        sort_order: 0
    });

    // Fetch payments from API
    const fetchPayments = async (page = 1, category = '', quality = '', limit = 20) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString()
            });

            if (category) params.append('category', category);
            if (quality) params.append('quality', quality);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment/admin/all?${params}`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${getCookie('token') || ''}`
                }
            });
            const data = await response.json();

            if (data.success) {
                setPayments(data.data);
                setPagination(data.pagination);
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
        fetchPayments(1, null, selectedQuality);
    }, [selectedCategory, selectedQuality]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCreateChannel = async () => {
        setModalMode('create');
        setCurrentChannel(null);
        setFormData({
            name: '',
            description: '',
            category_id: '',
            streaming_url: '',
            m3u8_url: '',
            thumbnail: '',
            logo: '',
            is_premium: false,
            is_online: true,
            quality: 'HD',
            language: 'English',
            country: 'International',
            sort_order: 0
        });
        setIsModalOpen(true);
    };

    const handleEditChannel = (channel) => {
        setModalMode('edit');
        setCurrentChannel(channel);
        setFormData({
            name: channel.name,
            description: channel.description,
            category_id: channel.category_id._id,
            streaming_url: channel.streaming_url,
            m3u8_url: channel.m3u8_url,
            thumbnail: channel.thumbnail,
            logo: channel.logo,
            is_premium: channel.is_premium,
            is_online: channel.is_online,
            quality: channel.quality,
            language: channel.language,
            country: channel.country,
            sort_order: channel.sort_order
        });
        setIsModalOpen(true);
    };

    const handleDeleteChannel = async (channelId) => {
        if (window.confirm('Are you sure you want to delete this channel?')) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/channel/${channelId}`, {
                    method: 'DELETE',
                });

                const data = await response.json();

                if (data.success) {
                    // Refresh the payments list
                    fetchPayments(pagination.current_page,
                        null,
                        selectedQuality
                    );
                } else {
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                console.error('Error deleting channel:', error);
                alert('Failed to delete channel. Please try again.');
            }
        }
    };



    const filteredPayments = payments.filter(channel => {
        const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            channel.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Handle pagination
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.total_pages) {
            fetchPayments(newPage, null, selectedQuality);
        }
    };

    // Handle search
    const handleSearch = () => {
        
        fetchPayments(1, null, selectedQuality);
    };

    const toggleChannelStatus = async (channelId) => {
        try {
            const channel = payments.find(ch => ch._id === channelId);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/channel/${channelId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    is_online: !channel.is_online
                })
            });

            const data = await response.json();

            if (data.success) {
                setPayments(prev => prev.map(ch =>
                    ch._id === channelId ? { ...ch, is_online: !ch.is_online } : ch
                ));
            } else {
                alert('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error updating channel status:', error);
            alert('Failed to update channel status. Please try again.');
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
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>

                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
                            <p className="text-gray-600 mt-1">Manage your streaming payments</p>
                        </div>
                        <Link
                            href="/admin/dashboard/payments/manual"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <ArrowRight className="w-4 h-4" />
                            Check Manual Payments
                        </Link>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                                value={selectedQuality}
                                onChange={(e) => setSelectedQuality(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Quality</option>
                                <option value="HD">HD</option>
                                <option value="SD">SD</option>
                                <option value="4K">4K</option>
                            </select>

                            <button
                                onClick={handleSearch}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                Apply Filters
                            </button>
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
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Channel
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quality
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Viewers
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Premium
                                        </th>
                                        <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredPayments.map((channel) => (
                                        <tr key={channel._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img
                                                        className="h-10 w-10 rounded-lg object-cover"
                                                        src={channel.logo || channel.thumbnail}
                                                        alt={channel.name}
                                                        onError={(e) => {
                                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                                                        }}
                                                    />
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{channel.name}</div>
                                                        <div className="text-sm text-gray-500">{channel.language} • {channel.country}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {channel.category_id.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${channel.quality === 'HD' ? 'bg-green-100 text-green-800' :
                                                    channel.quality === 'SD' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    {channel.quality}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {channel.viewer_count?.toLocaleString() || '0'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => toggleChannelStatus(channel._id)}
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${channel.is_online
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                        }`}
                                                >
                                                    {channel.is_online ? (
                                                        <>
                                                            <Eye className="w-3 h-3 mr-1" />
                                                            Online
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EyeOff className="w-3 h-3 mr-1" />
                                                            Offline
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {channel.is_premium ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        Premium
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        Free
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditChannel(channel)}
                                                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteChannel(channel._id)}
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

                    {/* Create/Edit Modal */}
                    {isModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {modalMode === 'create' ? 'Add New Channel' : 'Edit Channel'}
                                    </h2>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>


                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default PaymentManagement;
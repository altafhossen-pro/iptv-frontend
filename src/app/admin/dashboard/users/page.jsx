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
    Loader2
} from 'lucide-react';
import { getCookie } from 'cookies-next';
import toast from 'react-hot-toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
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

    // Fetch users from API
    const fetchUsers = async (page = 1, category = '', status = '', limit = 20) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString()
            });

            if (category) params.append('category', category);
            if (status) params.append('status', status);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/admin/all?${params}`, {
                headers: {
                    "Authorization": `Bearer ${getCookie('token') || ''}`,
                }
            });
            const data = await response.json();
            console.log(data?.data);
            if (data.success) {
                setUsers(data.data);
                setPagination(data.pagination);
            } else {
                console.error('Failed to fetch users:', data.message);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories (you'll need to create this endpoint)
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/category`);
            const data = await response.json();

            if (data.success) {
                setCategories(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchCategories();
    }, []);

    // Refetch when filters change
    useEffect(() => {
        const categorySlug = categories.find(cat => cat._id === selectedCategory)?.slug || '';
        fetchUsers(1, categorySlug, selectedStatus);
    }, [selectedCategory, selectedStatus]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCreateUser = async () => {
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
        // setModalMode('edit');
        // setCurrentChannel(channel);
        // setFormData({
        //     name: channel.name,
        //     description: channel.description,
        //     category_id: channel.category_id._id,
        //     streaming_url: channel.streaming_url,
        //     m3u8_url: channel.m3u8_url,
        //     thumbnail: channel.thumbnail,
        //     logo: channel.logo,
        //     is_premium: channel.is_premium,
        //     is_online: channel.is_online,
        //     quality: channel.quality,
        //     language: channel.language,
        //     country: channel.country,
        //     sort_order: channel.sort_order
        // });
        // setIsModalOpen(true);
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone. User will be permanently deleted.')) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/admin/${userId}`, {
                    headers: {
                        "Authorization": `Bearer ${getCookie('token') || ''}`,
                    },
                    method: 'DELETE',
                });

                const data = await response.json();

                if (data.success) {
                    // Refresh the users list
                    fetchUsers(pagination.current_page,
                        categories.find(cat => cat._id === selectedCategory)?.slug || '',
                        selectedStatus
                    );
                    toast.success('User deleted successfully!');

                } else {
                    toast.error('Error: ' + data.message);
                }
            } catch (error) {
                console.error('Error deleting channel:', error);
                alert('Failed to delete channel. Please try again.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = modalMode === 'create'
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/channel`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/channel/${currentChannel._id}`;

            const method = modalMode === 'create' ? 'POST' : 'PUT';

            const response = await fetch(url, {
                method,
                headers: {
                    "Authorization": `Bearer ${getCookie('token') || ''}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                // Refresh the users list
                fetchUsers(pagination.current_page,
                    categories.find(cat => cat._id === selectedCategory)?.slug || '',
                    selectedStatus
                );
                toast.success(modalMode === 'create' ? 'Channel created successfully!' : 'Channel updated successfully!');
                setIsModalOpen(false);
            } else {
                toast.error('Error: ' + data.message);
            }
        } catch (error) {
            console.error('Error saving channel:', error);
            toast.error('Failed to save or update channel. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user?.sid.toLowerCase().includes(searchTerm.toLowerCase()) || user?.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ;
        return matchesSearch;
    });

    // Handle pagination
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.total_pages) {
            const categorySlug = categories.find(cat => cat._id === selectedCategory)?.slug || '';
            fetchUsers(newPage, categorySlug, selectedStatus);
        }
    };

    // Handle search
    const handleSearch = () => {
        const categorySlug = categories.find(cat => cat._id === selectedCategory)?.slug || '';
        fetchUsers(1, categorySlug, selectedStatus);
    };

    const toggleChannelStatus = async (channelId) => {
        try {
            const channel = users.find(ch => ch._id === channelId);
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
                setUsers(prev => prev.map(ch =>
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
                            <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
                            <p className="text-gray-600 mt-1">Manage your streaming users</p>
                        </div>
                        <button
                            onClick={handleCreateUser}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Channel
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
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
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                                <option value="deleted">Deleted</option>
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
                                    <p className="text-sm text-gray-600">Total Users</p>
                                    <p className="text-2xl font-bold text-gray-900">{pagination.total_records}</p>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <Play className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Online Channels</p>
                                    <p className="text-2xl font-bold text-green-600">{users.filter(ch => ch.is_online).length}</p>
                                </div>
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <Eye className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Premium Channels</p>
                                    <p className="text-2xl font-bold text-purple-600">{users.filter(ch => ch.is_premium).length}</p>
                                </div>
                                <div className="bg-purple-100 p-3 rounded-lg">
                                    <Globe className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Viewers</p>
                                    <p className="text-2xl font-bold text-orange-600">{users.reduce((sum, ch) => sum + (ch.viewer_count || 0), 0)}</p>
                                </div>
                                <div className="bg-orange-100 p-3 rounded-lg">
                                    <Users className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Channels Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            SID
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        
                                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50">
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                                {user.email || 'N/A'}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                                {user.sid || 'N/A'}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                                {user?.name || 'N/A'}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                                {user?.phone || 'N/A'}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' :
                                                    user.status === 'SD' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditChannel(user)}
                                                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id)}
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

                                <form onSubmit={handleSubmit} className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Basic Information */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Channel Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Enter channel name"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Description *
                                                </label>
                                                <textarea
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    required
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Enter channel description"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Category *
                                                </label>
                                                <select
                                                    name="category_id"
                                                    value={formData.category_id}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="">Select category</option>
                                                    {categories.map(category => (
                                                        <option key={category._id} value={category._id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Quality *
                                                    </label>
                                                    <select
                                                        name="quality"
                                                        value={formData.quality}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        <option value="SD">SD</option>
                                                        <option value="HD">HD</option>
                                                        <option value="4K">4K</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Language *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="language"
                                                        value={formData.language}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="e.g. English, Hindi"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Country *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="country"
                                                        value={formData.country}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="e.g. USA, India"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Sort Order
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="sort_order"
                                                        value={formData.sort_order}
                                                        onChange={handleInputChange}
                                                        min="0"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Streaming Information */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-medium text-gray-900">Streaming Information</h3>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Streaming URL *
                                                </label>
                                                <input
                                                    type="url"
                                                    name="streaming_url"
                                                    value={formData.streaming_url}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="https://example.com/stream.m3u8"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    M3U8 URL
                                                </label>
                                                <input
                                                    type="url"
                                                    name="m3u8_url"
                                                    value={formData.m3u8_url}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="https://example.com/playlist.m3u8"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Thumbnail URL *
                                                </label>
                                                <input
                                                    type="url"
                                                    name="thumbnail"
                                                    value={formData.thumbnail}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="https://example.com/thumbnail.jpg"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Logo URL *
                                                </label>
                                                <input
                                                    type="url"
                                                    name="logo"
                                                    value={formData.logo}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="https://example.com/logo.jpg"
                                                />
                                            </div>

                                            {/* Preview Images */}
                                            {(formData.thumbnail || formData.logo) && (
                                                <div className="space-y-3">
                                                    <h4 className="text-sm font-medium text-gray-700">Preview</h4>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {formData.thumbnail && (
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-2">Thumbnail</p>
                                                                <img
                                                                    src={formData.thumbnail}
                                                                    alt="Thumbnail preview"
                                                                    className="w-full h-20 object-cover rounded-lg border"
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                        {formData.logo && (
                                                            <div>
                                                                <p className="text-xs text-gray-500 mb-2">Logo</p>
                                                                <img
                                                                    src={formData.logo}
                                                                    alt="Logo preview"
                                                                    className="w-full h-20 object-cover rounded-lg border"
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Channel Settings */}
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-medium text-gray-700">Settings</h4>

                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        name="is_premium"
                                                        checked={formData.is_premium}
                                                        onChange={handleInputChange}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label className="ml-2 text-sm text-gray-700">
                                                        Premium Channel
                                                    </label>
                                                </div>

                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        name="is_online"
                                                        checked={formData.is_online}
                                                        onChange={handleInputChange}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <label className="ml-2 text-sm text-gray-700">
                                                        Channel Online
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                            {modalMode === 'create' ? 'Create Channel' : 'Update Channel'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default UserManagement;
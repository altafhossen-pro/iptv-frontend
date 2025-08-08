'use client';
import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    X,
    Save,
    FolderOpen,
    Flag,
    Tv,
    Music,
    Newspaper,
    Baby,
    School,
    Film,
    Globe,
    Star,
    Heart,
    Home
} from 'lucide-react';

const CategoriesManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        icon: 'folder-open',
        sort_order: 0
    });

    // Available icons for categories
    const availableIcons = [
        { value: 'folder-open', label: 'Folder', component: FolderOpen },
        { value: 'flag', label: 'Flag', component: Flag },
        { value: 'tv', label: 'TV', component: Tv },
        { value: 'music', label: 'Music', component: Music },
        { value: 'newspaper', label: 'News', component: Newspaper },
        { value: 'baby', label: 'Kids', component: Baby },
        { value: 'school', label: 'Education', component: School },
        { value: 'film', label: 'Movies', component: Film },
        { value: 'globe', label: 'Global', component: Globe },
        { value: 'star', label: 'Premium', component: Star },
        { value: 'heart', label: 'Entertainment', component: Heart },
        { value: 'home', label: 'Home', component: Home }
    ];

    // Fetch categories from API
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/category`);
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data?.data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setErrorMessage('Failed to load categories. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Create new category
    const handleCreateCategory = async () => {
        if (!formData.name.trim()) {
            setErrorMessage('Category name is required');
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create category');
            }

            setSuccessMessage('Category created successfully!');
            setShowCreateModal(false);
            resetForm();
            fetchCategories(); // Refresh the list

        } catch (error) {
            console.error('Error creating category:', error);
            setErrorMessage(error.message || 'Failed to create category');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete category
    const handleDeleteCategory = async () => {
        if (!selectedCategory) return;
        
        setIsSubmitting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/category/${selectedCategory._id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete category');
            }

            setSuccessMessage('Category deleted successfully!');
            setShowDeleteModal(false);
            setSelectedCategory(null);
            fetchCategories(); // Refresh the list

        } catch (error) {
            console.error('Error deleting category:', error);
            setErrorMessage('Failed to delete category');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            icon: 'folder-open',
            sort_order: 0
        });
    };

    // Open create modal
    const openCreateModal = () => {
        resetForm();
        setShowCreateModal(true);
    };

    // Open edit modal
    const openEditModal = (category) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            icon: category.icon || 'folder-open',
            sort_order: category.sort_order || 0
        });
        setShowEditModal(true);
    };

    // Open delete modal
    const openDeleteModal = (category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };

    // Get icon component
    const getIconComponent = (iconName) => {
        const iconData = availableIcons.find(icon => icon.value === iconName);
        return iconData ? iconData.component : FolderOpen;
    };

    // Filter categories based on search
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Clear messages after 3 seconds
    useEffect(() => {
        if (errorMessage || successMessage) {
            const timer = setTimeout(() => {
                setErrorMessage('');
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage, successMessage]);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Categories Management</h2>
                    <p className="text-gray-600 mt-1">Manage your IPTV channel categories</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-sm hover:shadow-md border border-blue-600"
                >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Add Category</span>
                    <span className="sm:hidden">Add</span>
                </button>
            </div>

            {/* Success/Error Messages */}
            {successMessage && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl">
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                    {errorMessage}
                </div>
            )}

            {/* Search Bar */}
            <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                />
            </div>

            {/* Categories Grid */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {filteredCategories.map((category) => {
                        const IconComponent = getIconComponent(category.icon);
                        return (
                            <div key={category._id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-200">
                                <div className="p-4 sm:p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-200">
                                                <IconComponent className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-semibold text-gray-900 truncate">{category.name}</h3>
                                                <p className="text-xs text-slate-500 mt-0.5">Sort: {category.sort_order}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                                            <button
                                                onClick={() => openEditModal(category)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit category"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(category)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete category"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {category.description && (
                                        <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">{category.description}</p>
                                    )}
                                    
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                        <span className="text-sm font-medium text-slate-900">
                                            {category.channelCount || 0} channels
                                        </span>
                                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                                            category.status === 'active' 
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                                : 'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                            {category.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && filteredCategories.length === 0 && (
                <div className="text-center py-16 px-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FolderOpen className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No categories found</h3>
                    <p className="text-slate-500 max-w-md mx-auto">
                        {searchTerm ? 'Try adjusting your search terms to find what you\'re looking for' : 'Get started by creating your first category to organize your channels'}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={openCreateModal}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all duration-200 mx-auto"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create First Category</span>
                        </button>
                    )}
                </div>
            )}

            {/* Create Category Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900">Create New Category</h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Category Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="Enter category name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                    placeholder="Enter category description"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Icon
                                </label>
                                <select
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                >
                                    {availableIcons.map((icon) => (
                                        <option key={icon.value} value={icon.value}>
                                            {icon.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Sort Order
                                </label>
                                <input
                                    type="number"
                                    name="sort_order"
                                    value={formData.sort_order}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-3 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="0"
                                />
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row justify-end space-y-reverse space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="w-full sm:w-auto px-4 py-2.5 text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCreateCategory}
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
                                >
                                    {isSubmitting ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    <span>{isSubmitting ? 'Creating...' : 'Create Category'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedCategory && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200">
                        <div className="p-6">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4 border border-red-200">
                                    <Trash2 className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">Delete Category</h3>
                                    <p className="text-slate-600 text-sm">This action cannot be undone</p>
                                </div>
                            </div>
                            
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                <p className="text-red-800 text-sm">
                                    Are you sure you want to delete <strong>"{selectedCategory.name}"</strong>? 
                                    This will affect all channels in this category.
                                </p>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row justify-end space-y-reverse space-y-3 sm:space-y-0 sm:space-x-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="w-full sm:w-auto px-4 py-2.5 text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteCategory}
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
                                >
                                    {isSubmitting ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                    <span>{isSubmitting ? 'Deleting...' : 'Delete'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesManagement;
import React, { useState } from 'react';
import { Star, Crown, CheckCircle, X, CreditCard } from 'lucide-react';

const SubscriptionUpgrade = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMonths, setSelectedMonths] = useState(1);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const pricePerMonth = 79;
    const totalPrice = selectedMonths * pricePerMonth;

    const monthOptions = [
        { value: 1, label: '1 Month', discount: 0 },
        { value: 3, label: '3 Months', discount: 5 },
        { value: 6, label: '6 Months', discount: 10 },
        { value: 12, label: '12 Months', discount: 15 }
    ];

    const calculateDiscountedPrice = (months) => {
        const option = monthOptions.find(opt => opt.value === months);
        const originalPrice = months * pricePerMonth;
        const discount = option ? option.discount : 0;
        return originalPrice - (originalPrice * discount / 100);
    };

    const handleUpgrade = () => {
        setIsModalOpen(true);
    };

    const handleProceedToPayment = () => {
        if (agreedToTerms) {
            // এখানে আপনার payment API call করবেন
            console.log('Processing payment for', selectedMonths, 'months, total:', calculateDiscountedPrice(selectedMonths));
            // আপাতত modal বন্ধ করে দিচ্ছি
            setIsModalOpen(false);
            setAgreedToTerms(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setAgreedToTerms(false);
    };

    return (
        <>
            {/* Upgrade Card */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 shadow-xl border border-purple-500/30 my-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <Crown className="text-yellow-400" size={28} />
                        <h3 className="text-2xl font-bold text-white">Upgrade to Premium</h3>
                    </div>
                    <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                        Popular
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex items-baseline space-x-2 mb-2">
                        <span className="text-4xl font-bold text-white">৳{pricePerMonth}</span>
                        <span className="text-purple-200">/month</span>
                    </div>
                    <p className="text-purple-100">Unlock premium features and enjoy unlimited streaming</p>
                </div>

                <div className="space-y-3 mb-6">
                    {[
                        '100+ Premium channels',
                        'No advertisements',
                        'Multiple device support',
                        '24/7 customer support'
                    ].map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="text-green-400" size={16} />
                            <span className="text-purple-100 text-sm">{feature}</span>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleUpgrade}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-6 rounded-lg transition duration-300   cursor-pointer"
                >
                    Upgrade Now
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto no-scrollbar">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                            <h2 className="text-2xl font-bold text-white">Choose Your Plan</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-white transition duration-200"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            {/* Month Selection */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Select Duration</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {monthOptions.map((option) => (
                                        <div
                                            key={option.value}
                                            onClick={() => setSelectedMonths(option.value)}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition duration-200 ${selectedMonths === option.value
                                                    ? 'border-purple-500 bg-purple-600/20'
                                                    : 'border-gray-600 hover:border-gray-500'
                                                }`}
                                        >
                                            <div className="text-white font-medium">{option.label}</div>
                                            {option.discount > 0 && (
                                                <div className="text-green-400 text-sm">Save {option.discount}%</div>
                                            )}
                                            <div className="text-purple-200 text-sm mt-1">
                                                ৳{calculateDiscountedPrice(option.value).toFixed(0)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="mb-6 p-4 bg-gray-700/50 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-300">Duration:</span>
                                    <span className="text-white font-medium">{selectedMonths} Month{selectedMonths > 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-300">Price per month:</span>
                                    <span className="text-white">৳{pricePerMonth}</span>
                                </div>
                                {monthOptions.find(opt => opt.value === selectedMonths)?.discount > 0 && (
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-300">Discount:</span>
                                        <span className="text-green-400">-{monthOptions.find(opt => opt.value === selectedMonths)?.discount}%</span>
                                    </div>
                                )}
                                <hr className="border-gray-600 my-2" />
                                <div className="flex justify-between items-center">
                                    <span className="text-white font-bold">Total:</span>
                                    <span className="text-purple-400 font-bold text-xl">৳{calculateDiscountedPrice(selectedMonths).toFixed(0)}</span>
                                </div>
                            </div>

                            {/* Terms and Conditions */}
                            <div className="mb-6">
                                <label className="flex items-start space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="mt-1 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                                    />
                                    <span className="text-sm text-gray-300 leading-tight">
                                        I agree to the <span className="text-purple-400 hover:underline cursor-pointer">Terms and Conditions</span> and <span className="text-purple-400 hover:underline cursor-pointer">Privacy Policy</span>. The subscription will auto-renew unless cancelled.
                                    </span>
                                </label>
                            </div>

                            {/* Payment Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={handleProceedToPayment}
                                    disabled={!agreedToTerms}
                                    className={`w-full py-3 px-6 rounded-lg font-bold transition duration-300 flex items-center justify-center space-x-2 ${agreedToTerms
                                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                                            : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <CreditCard size={20} />
                                    <span>Pay with bKash</span>
                                </button>

                                <button
                                    onClick={closeModal}
                                    className="w-full py-3 px-6 rounded-lg font-medium text-gray-300 border border-gray-600 hover:bg-gray-700 transition duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SubscriptionUpgrade;
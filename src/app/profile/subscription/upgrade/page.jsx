'use client';

import React, { useState } from 'react';
import { Crown, ArrowLeft, CreditCard, Phone, MessageCircle, CheckCircle } from 'lucide-react';
import Header from '@/components/Header/Header';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

const SubscriptionUpgradePage = () => {
    const [selectedMonths, setSelectedMonths] = useState(1);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('bkash'); // 'bkash' or 'manual'
    const [manualPaymentData, setManualPaymentData] = useState({
        senderNumber: '',
        transactionId: '',
        paymentType: '' // 'bkash' or 'nogod'
    });
    const router = useRouter();

    const pricePerMonth = 79;

    const monthOptions = [
        { value: 1, label: '1 Month', discount: 0, popular: false },
        { value: 3, label: '3 Months', discount: 5, popular: false },
        { value: 6, label: '6 Months', discount: 10, popular: true },
        { value: 12, label: '12 Months', discount: 15, popular: false }
    ];

    const calculateDiscountedPrice = (months) => {
        const option = monthOptions.find(opt => opt.value === months);
        const originalPrice = months * pricePerMonth;
        const discount = option ? option.discount : 0;
        return originalPrice - (originalPrice * discount / 100);
    };

    const calculateSavings = (months) => {
        const option = monthOptions.find(opt => opt.value === months);
        if (!option || option.discount === 0) return 0;
        const originalPrice = months * pricePerMonth;
        return originalPrice * option.discount / 100;
    };

    const handleSubmitManualPayment = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/subscription/manual-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie('token')}`
                },
                body: JSON.stringify({
                    months: selectedMonths,
                    amount: calculateDiscountedPrice(selectedMonths),
                    senderNumber: manualPaymentData.senderNumber,
                    transaction_id: manualPaymentData.transactionId,
                    payment_method: manualPaymentData.paymentType
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit manual payment');
            }

            const data = await response.json();
            toast.success('Manual payment submitted successfully! Please wait for Admin  confirmation.', {
                duration: 8000,
                position: 'top-center'
            });
            router.push('/profile');

            
        } catch (error) {
            console.error('Error submitting manual payment:', error);
            toast.error(error.message || 'Failed to submit manual payment');
        }
        finally {
            setManualPaymentData({
                senderNumber: '',
                transactionId: '',
                paymentType: ''
            });
        }
    }

    const handlePayment = () => {
        if (!agreedToTerms) return;

        if (paymentMethod === 'bkash') {
            toast.error('Bkash payment is currently offline. Please use manual payment.');
            return;
            console.log('Processing bKash merchant payment for', selectedMonths, 'months, total:', calculateDiscountedPrice(selectedMonths));
            // Handle bKash merchant payment
        } else {
            console.log('Processing manual payment:', {
                months: selectedMonths,
                total: calculateDiscountedPrice(selectedMonths),
                ...manualPaymentData
            });
            if (!manualPaymentData.senderNumber || !manualPaymentData.transactionId) {
                toast.error('Please fill in all manual payment fields.');
                return;
            }
            handleSubmitManualPayment();
            
        }
    };


    const handleWhatsAppSupport = () => {
        const message = `Hi, I want to upgrade to Premium subscription for ${selectedMonths} month${selectedMonths > 1 ? 's' : ''} (৳${calculateDiscountedPrice(selectedMonths).toFixed(0)}). Please help me with the payment process.`;
        const whatsappUrl = `https://wa.me/8801610800474?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const goBack = () => {
        window.history.back();
    };

    const isFormValid = paymentMethod === 'bkash' ||
        (paymentMethod === 'manual' && manualPaymentData.senderNumber && manualPaymentData.transactionId);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <Header />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Comparison */}
                    <div>
                        <div className="space-y-6">
                            {/* Plan Selection */}
                            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                                <h3 className="text-xl font-bold mb-4">Choose Your Plan</h3>
                                <div className="space-y-3">
                                    {monthOptions.map((option) => (
                                        <div
                                            key={option.value}
                                            onClick={() => setSelectedMonths(option.value)}
                                            className={`relative p-4 rounded-lg border-2 cursor-pointer transition duration-200 ${selectedMonths === option.value
                                                ? 'border-purple-500 bg-purple-600/20'
                                                : 'border-gray-600 hover:border-gray-500'
                                                }`}
                                        >
                                            {option.popular && (
                                                <div className="absolute -top-2 left-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                                                    Most Popular
                                                </div>
                                            )}
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <div className="text-white font-medium">{option.label}</div>
                                                    {option.discount > 0 && (
                                                        <div className="text-green-400 text-sm">Save {option.discount}%</div>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-purple-200 font-bold">
                                                        ৳{calculateDiscountedPrice(option.value).toFixed(0)}
                                                    </div>
                                                    {option.discount > 0 && (
                                                        <div className="text-gray-500 text-sm line-through">
                                                            ৳{(option.value * pricePerMonth).toFixed(0)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Price Summary */}

                        </div>
                    </div>

                    {/* Right Column - Pricing & Payment */}
                    <div className='flex flex-col space-y-6'>
                        <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-6 rounded-lg border border-purple-500/30">
                            <h3 className="text-lg font-bold mb-4">Order Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Duration:</span>
                                    <span className="text-white font-medium">{selectedMonths} Month{selectedMonths > 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Price per month:</span>
                                    <span className="text-white">৳{pricePerMonth}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Subtotal:</span>
                                    <span className="text-white">৳{(selectedMonths * pricePerMonth).toFixed(0)}</span>
                                </div>
                                {calculateSavings(selectedMonths) > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-300">Discount:</span>
                                        <span className="text-green-400">-৳{calculateSavings(selectedMonths).toFixed(0)}</span>
                                    </div>
                                )}
                                <hr className="border-gray-600" />
                                <div className="flex justify-between items-center">
                                    <span className="text-white font-bold text-lg">Total:</span>
                                    <span className="text-purple-400 font-bold text-2xl">৳{calculateDiscountedPrice(selectedMonths).toFixed(0)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                            <h3 className="text-lg font-bold mb-4">Payment Method</h3>
                            <div className="space-y-3">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="bkash"
                                        checked={paymentMethod === 'bkash'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-purple-600"
                                    />
                                    <div className="flex items-center space-x-2">
                                        <CreditCard className="text-pink-400" size={20} />
                                        <span className="text-white">bKash Merchant (Automatic)</span>
                                    </div>
                                </label>

                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="manual"
                                        checked={paymentMethod === 'manual'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-purple-600"
                                    />
                                    <div className="flex items-center space-x-2">
                                        <Phone className="text-blue-400" size={20} />
                                        <span className="text-white">Manual Payment</span>
                                    </div>
                                </label>
                            </div>

                            {/* Manual Payment Form */}
                            {paymentMethod === 'manual' && (
                                <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
                                    <h4 className="font-semibold mb-4 text-yellow-400">Send Money to:</h4>
                                    <div className="space-y-2 mb-4 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-300">bKash Merchant:</span>
                                            <span className="text-white font-mono">01610800474</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-300">bKash/Nagad Personal:</span>
                                            <span className="text-white font-mono">01840209060</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Payment Method *
                                            </label>
                                            <select
                                                value={manualPaymentData.paymentType}
                                                onChange={(e) => setManualPaymentData({ ...manualPaymentData, paymentType: e.target.value })}
                                                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                                            >
                                                <option disabled value="">Select Method</option>
                                                <option value="bkash">bKash</option>
                                                <option value="nogod">Nagad</option>
                                            </select>

                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Your Number (Sender) *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="01xxxxxxxxx"
                                                value={manualPaymentData.senderNumber}
                                                onChange={(e) => setManualPaymentData({ ...manualPaymentData, senderNumber: e.target.value })}
                                                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Transaction ID *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter transaction ID"
                                                value={manualPaymentData.transactionId}
                                                onChange={(e) => setManualPaymentData({ ...manualPaymentData, transactionId: e.target.value })}
                                                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Terms and Payment */}
                        <div className=" bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
                            <label className="flex items-start space-x-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="mt-1 w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-300 leading-tight">
                                    I agree to the <Link href={`/terms-and-condition`} className="text-purple-400 hover:underline cursor-pointer">Terms and Conditions</Link> and <Link href={`/privacy-policy`} className="text-purple-400 hover:underline cursor-pointer">Privacy Policy</Link>. The subscription will auto-renew unless cancelled.
                                </span>
                            </label>

                            <button
                                onClick={handlePayment}
                                disabled={!agreedToTerms || !isFormValid}
                                className={`w-full py-4 px-6 rounded-lg font-bold transition duration-300 flex items-center justify-center space-x-2 ${agreedToTerms && isFormValid
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg transform hover:scale-[1.02] cursor-pointer'
                                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <CreditCard size={20} />
                                <span>
                                    {paymentMethod === 'bkash' ? 'Pay with bKash (Live)' : 'Submit Manual Payment'}
                                </span>
                            </button>

                            {/* WhatsApp Support */}
                            <div className="pt-4 border-t border-gray-700">
                                <p className="text-sm text-gray-400 mb-3 text-center">Need help with payment?</p>
                                <button
                                    onClick={handleWhatsAppSupport}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300 flex items-center justify-center space-x-2"
                                >
                                    <MessageCircle size={18} />
                                    <span>WhatsApp Support: 01610800474</span>
                                </button>
                            </div>

                            <div className="text-center pt-2">
                                <p className="text-xs text-gray-400 mb-2">Secure payment powered by</p>
                                <div className="flex justify-center space-x-4">
                                    <div className="bg-pink-600 text-white px-3 py-1 rounded text-xs font-bold">bKash</div>
                                    <div className="bg-orange-600 text-white px-3 py-1 rounded text-xs font-bold">Nagad</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionUpgradePage;
'use client';

import React from 'react';
import { Crown, Check, Star, ArrowRight, Zap, Shield, Users, Globe } from 'lucide-react';
import Header from '@/components/Header/Header';
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '@/provider/AuthProvider';

const PricingPage = () => {
  const { user } = useContext(AuthContext);

  const plans = [
    {
      name: 'Free',
      price: '0',
      currency: '৳',
      duration: 'Lifetime',
      description: 'Perfect for getting started with IPTV',
      features: [
        'Access to basic channels',
        'Standard video quality',
        'Community support',
        'Basic features',
        'Limited channel selection'
      ],
      buttonText: 'Get Started Free',
      buttonLink: user?.email ? '/profile/subscription/upgrade' : '/register',
      popular: false,
      color: 'from-gray-600 to-gray-700',
      borderColor: 'border-gray-600',
      icon: Globe
    },
    {
      name: 'Premium',
      price: '79',
      currency: '৳',
      duration: 'per month',
      description: 'Unlock the full IPTV experience with premium features',
      features: [
        'Access to all premium channels',
        'Priority customer support',
        'Unlimited channel selection',
        'Multi-device streaming',
        'Ad-free experience',
        'Early access to new features'
      ],
      buttonText: user?.email ? 'Upgrade Now' : 'Get Premium',
      buttonLink: user?.email ? '/profile/subscription/upgrade' : '/login',
      popular: true,
      color: 'from-purple-600 to-blue-600',
      borderColor: 'border-purple-500',
      icon: Crown
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Stream your favorite content without buffering or delays'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data and privacy are protected with enterprise-grade security'
    },
    {
      icon: Users,
      title: '24/7 Support',
      description: 'Get help whenever you need it with our dedicated support team'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Access your content from anywhere in the world'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-gray-900"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
              Choose Your Plan
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Start with our free plan or unlock premium features for the ultimate IPTV experience
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2 bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700">
                  <benefit.icon className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300 text-sm">{benefit.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-gray-800 rounded-2xl border-2 ${plan.borderColor} p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                plan.popular ? 'ring-2 ring-purple-500 ring-opacity-50' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${plan.color}`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">{plan.currency}</span>
                    <span className="text-6xl font-bold text-white ml-1">{plan.price}</span>
                    {plan.duration !== 'Lifetime' && (
                      <span className="text-xl text-gray-400 ml-2">{plan.duration}</span>
                    )}
                  </div>
                  {plan.duration === 'Lifetime' && (
                    <span className="text-xl text-gray-400">Lifetime</span>
                  )}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <Link
                href={plan.buttonLink}
                className={`block w-full py-4 px-6 rounded-xl font-bold text-center transition-all duration-300 transform hover:scale-105 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg'
                    : 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 hover:border-gray-500'
                }`}
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>{plan.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-lg">Everything you need to know about our plans</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-3">Can I switch plans anytime?</h3>
            <p className="text-gray-300">Yes! You can upgrade to Premium at any time. Your billing will be prorated accordingly.</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-3">Is there a free trial?</h3>
            <p className="text-gray-300">Yes! Start with our free plan to experience the basic features before upgrading.</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-3">What payment methods do you accept?</h3>
            <p className="text-gray-300">We accept bKash, Nagad, and manual payments. All transactions are secure and encrypted.</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-3">Can I cancel my subscription?</h3>
            <p className="text-gray-300">Absolutely! You can cancel your Premium subscription at any time from your profile settings.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl border border-purple-500/30 p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of satisfied users enjoying premium IPTV content
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={user?.email ? '/profile/subscription/upgrade' : '/register'}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {user?.email ? 'Upgrade to Premium' : 'Start Free Trial'}
            </Link>
            <Link
              href="/contact"
              className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 border border-gray-600 hover:border-gray-500"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;

import React from 'react';
import { Tv, Users, Globe, Shield, Mail, MessageCircle, Star, Award } from 'lucide-react';
import Header from '@/components/Header/Header';

const AboutUsPage = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header />
            {/* Hero Section */}
            <div className="mt-10">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <div className="flex justify-center mb-6">
                        <Tv className="text-yellow-400" size={48} />
                    </div>
                    <h1 className="text-3xl font-bold mb-6">About Our Platform</h1>
                    <p className="text-lg text-purple-100 max-w-3xl mx-auto leading-relaxed">
                        We are dedicated to bringing together the best streaming content from around the world,
                        making entertainment accessible and convenient for everyone.
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-16">
                {/* Mission Section */}
                <div className="grid lg:grid-cols-2 gap-12 mb-20">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-purple-400">Our Mission</h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            Our platform serves as a comprehensive aggregator, bringing together diverse streaming
                            content from multiple sources worldwide. We believe entertainment should be accessible
                            to everyone, regardless of geographical boundaries.
                        </p>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            By consolidating various channels and content streams, we provide users with a
                            unified platform where they can discover and enjoy their favorite shows, sports,
                            news, and entertainment content all in one place.
                        </p>
                    </div>
                    <div className="flex justify-center items-center">
                        <div className="bg-gray-800 p-8 rounded-xl border border-gray-700">
                            <Globe className="text-blue-400 mb-4" size={48} />
                            <h3 className="text-xl font-bold mb-3">Global Content Access</h3>
                            <p className="text-gray-400">
                                Bringing worldwide entertainment to your fingertips
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <Users className="text-green-400" size={32} />,
                                title: 'Community Driven',
                                description: 'Built for users, by understanding what viewers really want'
                            },
                            {
                                icon: <Shield className="text-blue-400" size={32} />,
                                title: 'Reliable Platform',
                                description: 'Consistent service with minimal downtime and regular updates'
                            },
                            {
                                icon: <Star className="text-yellow-400" size={32} />,
                                title: 'Quality Experience',
                                description: 'Optimized streaming experience across all your devices'
                            },
                            {
                                icon: <Award className="text-purple-400" size={32} />,
                                title: 'Diverse Content',
                                description: 'Wide variety of channels and content from multiple genres'
                            }
                        ].map((feature, index) => (
                            <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-purple-500/30 transition duration-300">
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content Disclaimer */}
                <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 mb-20">
                    <h3 className="text-2xl font-bold mb-4 text-yellow-400">Content Information</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        Our platform aggregates publicly available streaming links and content from various
                        sources across the internet. We serve as a directory service, similar to how search
                        engines index web content.
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-4">
                        All content streams are sourced from publicly accessible URLs and streaming protocols.
                        We do not host, store, or modify any video content on our servers. Our role is purely
                        as an aggregation platform that organizes and presents these publicly available streams
                        in a user-friendly interface.
                    </p>
                    <div className="bg-blue-600/20 border border-blue-500/30 p-4 rounded-lg">
                        <p className="text-blue-200 text-sm">
                            <strong>Note:</strong> Stream quality and availability may vary as content is sourced
                            from multiple external providers. We continuously work to maintain the best possible
                            viewing experience for our users.
                        </p>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-8 rounded-xl border border-purple-500/30">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold mb-4">Get In Touch</h3>
                        <p className="text-gray-300">
                            Have questions, suggestions, or business inquiries? We'd love to hear from you!
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-gray-800/50 p-6 rounded-lg">
                            <div className="flex items-center space-x-3 mb-4">
                                <Mail className="text-purple-400" size={24} />
                                <h4 className="text-lg font-bold">Business Inquiries</h4>
                            </div>
                            <p className="text-gray-300 mb-4">
                                For business partnerships, advertising opportunities, or general inquiries,
                                please use our contact form or reach out via email.
                            </p>
                            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition duration-300">
                                Contact Form
                            </button>
                        </div>

                        <div className="bg-gray-800/50 p-6 rounded-lg">
                            <div className="flex items-center space-x-3 mb-4">
                                <MessageCircle className="text-green-400" size={24} />
                                <h4 className="text-lg font-bold">Support</h4>
                            </div>
                            <p className="text-gray-300 mb-4">
                                Need technical support or have questions about our service?
                                Our support team is here to help.
                            </p>
                            <div className="space-y-2 text-sm">
                                <div className="text-gray-400">Support Email:</div>
                                <div className="text-white font-mono">support@yourplatform.com</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;
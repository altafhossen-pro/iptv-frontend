import React from 'react';
import { Scale, AlertTriangle, Eye, Users, Shield, FileText, Globe } from 'lucide-react';
import Header from '@/components/Header/Header';

const TermsAndConditionsPage = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header />
            {/* Header */}
            <div className="border-b border-gray-700 py-6">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center space-x-4 mb-4">
                        <Scale className="text-purple-400" size={32} />
                        <h1 className="text-4xl font-bold">Terms and Conditions</h1>
                    </div>
                    <p className="text-gray-400">Last updated: January 2025</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Important Notice */}
                <div className="bg-yellow-600/20 border border-yellow-500/30 p-6 rounded-lg mb-8">
                    <div className="flex items-start space-x-3">
                        <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
                        <div>
                            <h3 className="font-bold text-yellow-300 mb-2">Important Notice</h3>
                            <p className="text-yellow-100 text-sm">
                                Please read these terms carefully before using our platform. By accessing and using 
                                our service, you acknowledge that you have read, understood, and agree to be bound by these terms.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Section 1: Acceptance of Terms */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-3 mb-4">
                            <FileText className="text-blue-400" size={24} />
                            <h2 className="text-2xl font-bold text-purple-400">1. Acceptance of Terms</h2>
                        </div>
                        <div className="text-gray-300 space-y-3">
                            <p>
                                By accessing and using this streaming platform, you accept and agree to be bound by the 
                                terms and provision of this agreement. If you do not agree to abide by the above, 
                                please do not use this service.
                            </p>
                            <p>
                                These terms may be updated periodically, and your continued use of the platform 
                                constitutes acceptance of any changes. We will notify users of significant changes 
                                through our platform or via email.
                            </p>
                        </div>
                    </div>

                    {/* Section 2: Service Description */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-3 mb-4">
                            <Globe className="text-green-400" size={24} />
                            <h2 className="text-2xl font-bold text-purple-400">2. Service Description</h2>
                        </div>
                        <div className="text-gray-300 space-y-3">
                            <p>
                                Our platform serves as an aggregation service that organizes and presents publicly 
                                available streaming content from various sources across the internet. We function 
                                as a directory service, similar to search engines that index web content.
                            </p>
                            <p>
                                All content streams are sourced from publicly accessible  streaming 
                                protocols available on the internet. Our platform does not host, store, upload, 
                                or modify any video content on our servers.
                            </p>
                            <p>
                                The primary purpose of our platform is to provide users with a centralized location 
                                to access various channels and streaming content for entertainment purposes, including 
                                but not limited to sports, news, movies, and TV shows.
                            </p>
                        </div>
                    </div>

                    {/* Section 3: Content Disclaimer */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-3 mb-4">
                            <Shield className="text-red-400" size={24} />
                            <h2 className="text-2xl font-bold text-purple-400">3. Content and Copyright</h2>
                        </div>
                        <div className="text-gray-300 space-y-3">
                            <p className="font-semibold text-yellow-300">
                                All content available through our platform is collected from free and publicly 
                                accessible sources on the internet.
                            </p>
                            <p>
                                We do not claim ownership of any content streamed through our platform. All copyright 
                                and intellectual property rights belong to their respective original owners, broadcasters, 
                                and content creators.
                            </p>
                            <p>
                                Our platform merely provides links to content that is already freely available online. 
                                We do not host, store, or distribute any copyrighted material on our servers.
                            </p>
                            <p>
                                If you are a copyright holder and believe your content is being linked inappropriately, 
                                please contact us through our support channels, and we will address your concerns promptly.
                            </p>
                            <div className="bg-red-600/20 border border-red-500/30 p-4 rounded-lg mt-4">
                                <p className="text-red-200 text-sm">
                                    <strong>Copyright Notice:</strong> All copyrights belong to the original channel owners 
                                    and content creators. Neither we nor our platform hold any copyright claims to the streamed content.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Quality and Availability */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-3 mb-4">
                            <Eye className="text-orange-400" size={24} />
                            <h2 className="text-2xl font-bold text-purple-400">4. Service Quality and Availability</h2>
                        </div>
                        <div className="text-gray-300 space-y-3">
                            <p>
                                Due to the nature of aggregating content from multiple external sources, stream quality 
                                and availability may vary. Factors affecting quality include:
                            </p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Source server stability and bandwidth</li>
                                <li>Geographic location of content sources</li>
                                <li>Internet connectivity of both source and user</li>
                                <li>Peak usage times and server load</li>
                                <li>Maintenance or updates by original content providers</li>
                            </ul>
                            <p>
                                We continuously work to maintain optimal service quality but cannot guarantee 
                                uninterrupted access or consistent quality across all content streams.
                            </p>
                            <div className="bg-blue-600/20 border border-blue-500/30 p-4 rounded-lg mt-4">
                                <p className="text-blue-200 text-sm">
                                    <strong>Quality Notice:</strong> Since we collect streams from internet, video quality 
                                    may sometimes be lower than premium services. We strive to provide the best available quality from our sources.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 5: User Responsibilities */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-3 mb-4">
                            <Users className="text-purple-400" size={24} />
                            <h2 className="text-2xl font-bold text-purple-400">5. User Responsibilities</h2>
                        </div>
                        <div className="text-gray-300 space-y-3">
                            <p>Users agree to:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Use the service only for personal, non-commercial purposes</li>
                                <li>Not attempt to copy, redistribute, or resell access to our platform</li>
                                <li>Not engage in any activity that could harm or interfere with our service</li>
                                <li>Respect the terms and conditions of original content providers</li>
                                <li>Comply with all applicable local, national, and international laws</li>
                                <li>Not use the service for any illegal or unauthorized purpose</li>
                                <li>Not attempt to gain unauthorized access to any part of our service</li>
                            </ul>
                            <p className="mt-4">
                                Users are responsible for their own internet connection and any data charges 
                                that may apply from their service provider.
                            </p>
                        </div>
                    </div>

                    {/* Section 6: Account Terms */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">6. Account Terms</h2>
                        <div className="text-gray-300 space-y-3">
                            <p>When creating an account on our platform, you agree to:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Provide accurate and complete information</li>
                                <li>Maintain the security of your account credentials</li>
                                <li>Accept responsibility for all activities under your account</li>
                                <li>Notify us immediately of any unauthorized use</li>
                            </ul>
                            <p>
                                We reserve the right to suspend or terminate accounts that violate these terms 
                                or engage in suspicious activity.
                            </p>
                        </div>
                    </div>

                    {/* Section 7: Payment Terms */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">7. Payment and Subscription Terms</h2>
                        <div className="text-gray-300 space-y-3">
                            <p>For premium subscriptions:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>All payments are processed securely through our payment partners</li>
                                <li>Subscriptions automatically renew unless cancelled</li>
                                <li>Refunds are subject to our refund policy</li>
                                <li>Prices may change with 30 days notice to existing subscribers</li>
                                <li>You can cancel your subscription at any time through your account settings</li>
                            </ul>
                            <p>
                                Manual payments are processed within 24-48 hours during business days. 
                                Premium features will be activated once payment is confirmed.
                            </p>
                        </div>
                    </div>

                    {/* Section 8: Limitation of Liability */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">8. Limitation of Liability</h2>
                        <div className="text-gray-300 space-y-3">
                            <p>
                                Our platform is provided "as is" without any warranties, express or implied. 
                                We are not responsible for:
                            </p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Content quality, availability, or accuracy</li>
                                <li>Any damages resulting from use of our service</li>
                                <li>Content provided by third-party sources</li>
                                <li>Interruption or termination of service</li>
                                <li>Any legal issues arising from content consumption</li>
                                <li>Loss of data or personal information</li>
                                <li>Any direct, indirect, incidental, or consequential damages</li>
                            </ul>
                            <p className="mt-4 font-semibold text-yellow-300">
                                Your use of this service is entirely at your own risk.
                            </p>
                        </div>
                    </div>

                    {/* Section 9: Privacy and Data */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">9. Privacy and Data Collection</h2>
                        <div className="text-gray-300 space-y-3">
                            <p>
                                We respect your privacy and are committed to protecting your personal information. 
                                Our data collection practices are detailed in our Privacy Policy.
                            </p>
                            <p>
                                We may collect basic usage analytics to improve our service quality and user experience. 
                                No personal viewing habits or content preferences are stored or shared with third parties.
                            </p>
                            <p>
                                By using our service, you consent to the collection and use of information as 
                                outlined in our Privacy Policy.
                            </p>
                        </div>
                    </div>

                    {/* Section 10: Prohibited Activities */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">10. Prohibited Activities</h2>
                        <div className="text-gray-300 space-y-3">
                            <p>Users are prohibited from:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Attempting to reverse engineer or hack our platform</li>
                                <li>Using automated systems to access our service</li>
                                <li>Sharing account credentials with multiple users</li>
                                <li>Attempting to overwhelm our servers with excessive requests</li>
                                <li>Using our service for commercial purposes without authorization</li>
                                <li>Violating any applicable laws or regulations</li>
                            </ul>
                            <p>
                                Violation of these terms may result in immediate account suspension or termination.
                            </p>
                        </div>
                    </div>

                    {/* Section 11: Termination */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">11. Service Termination</h2>
                        <div className="text-gray-300 space-y-3">
                            <p>
                                We reserve the right to terminate or suspend access to our service at any time, 
                                with or without notice, for any reason including violation of these terms.
                            </p>
                            <p>
                                Users may discontinue use of our service at any time without notice. 
                                Account data may be deleted after 30 days of inactivity.
                            </p>
                            <p>
                                Upon termination, all rights and licenses granted to you will immediately cease.
                            </p>
                        </div>
                    </div>

                    {/* Section 12: Changes to Terms */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">12. Changes to Terms</h2>
                        <div className="text-gray-300 space-y-3">
                            <p>
                                We reserve the right to modify these terms at any time. Changes will be effective 
                                immediately upon posting on our platform.
                            </p>
                            <p>
                                Significant changes will be communicated through:
                            </p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                                <li>Email notification (if available)</li>
                                <li>Prominent notice on our website</li>
                                <li>In-app notification</li>
                            </ul>
                            <p>
                                Your continued use after changes indicates acceptance of the updated terms.
                            </p>
                        </div>
                    </div>

                    {/* Section 13: Governing Law */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">13. Governing Law</h2>
                        <div className="text-gray-300 space-y-3">
                            <p>
                                These terms shall be governed by and construed in accordance with the laws of Bangladesh, 
                                without regard to its conflict of law provisions.
                            </p>
                            <p>
                                Any disputes arising from these terms or use of our service shall be resolved 
                                through appropriate legal channels in Bangladesh.
                            </p>
                        </div>
                    </div>

                    {/* Section 14: Contact Information */}
                    <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-6 rounded-lg border border-purple-500/30">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">14. Contact and Support</h2>
                        <div className="text-gray-300 space-y-3">
                            <p>
                                For business inquiries, technical support, or questions regarding these terms, 
                                please contact us through:
                            </p>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-gray-800/50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-white mb-2">Business Inquiries:</h4>
                                    <ul className="space-y-1 text-sm">
                                        <li>📧 Contact form on our website</li>
                                        <li>📧 Email: business@yourplatform.com</li>
                                        <li>⏱️ Response: Within 48 hours</li>
                                    </ul>
                                </div>
                                <div className="bg-gray-800/50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-white mb-2">Technical Support:</h4>
                                    <ul className="space-y-1 text-sm">
                                        <li>📧 Email: support@yourplatform.com</li>
                                        <li>💬 WhatsApp: 01610800474</li>
                                        <li>⏱️ Available: 9 AM - 11 PM (GMT+6)</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="text-sm text-gray-400 mt-4">
                                We strive to respond to all inquiries within 48 hours during business days.
                            </p>
                        </div>
                    </div>

                    {/* Last Updated */}
                    <div className="text-center text-gray-400 text-sm mt-12">
                        <p>These terms and conditions were last updated on January 15, 2025</p>
                        <p className="mt-2">Please check back periodically for any updates or changes</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditionsPage;
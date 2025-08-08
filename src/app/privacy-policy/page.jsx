import React from 'react';
import { Shield, Eye, Database, Lock, UserCheck, Globe, AlertCircle } from 'lucide-react';
import Header from '@/components/Header/Header';

const PrivacyPolicyPage = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header />
            {/* Header */}
            <div className=" border-b border-gray-700 py-6">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center space-x-4 mb-4">
                        <Shield className="text-green-400" size={32} />
                        <h1 className="text-4xl font-bold">Privacy Policy</h1>
                    </div>
                    <p className="text-gray-400">Last updated: January 2025</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Privacy Notice */}
                <div className="bg-green-600/20 border border-green-500/30 p-6 rounded-lg mb-8">
                    <div className="flex items-start space-x-3">
                        <Eye className="text-green-400 flex-shrink-0 mt-1" size={20} />
                        <div>
                            <h3 className="font-bold text-green-300 mb-2">Your Privacy Matters</h3>
                            <p className="text-green-100 text-sm">
                                We are committed to protecting your privacy and personal information. This policy
                                explains how we collect, use, and safeguard your data when you use our streaming platform.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Section 1: Information We Collect */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-3 mb-4">
                            <Database className="text-blue-400" size={24} />
                            <h2 className="text-2xl font-bold text-purple-400">1. Information We Collect</h2>
                        </div>
                        <div className="text-gray-300 space-y-4">
                            <div>
                                <h3 className="font-semibold text-white mb-2">Account Information:</h3>
                                <p>When you create an account, we may collect:</p>
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                    <li>Username and email address</li>
                                    <li>Payment information for premium subscriptions</li>
                                    <li>Profile preferences and settings</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-white mb-2">Usage Information:</h3>
                                <p>We automatically collect certain information when you use our platform:</p>
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                    <li>Device information (browser type, operating system)</li>
                                    <li>IP address and general location</li>
                                    <li>Pages visited and time spent on our platform</li>
                                    <li>Basic usage analytics and performance metrics</li>
                                </ul>
                            </div>

                            <div className="bg-blue-600/20 border border-blue-500/30 p-4 rounded-lg">
                                <p className="text-blue-200 text-sm">
                                    <strong>Important:</strong> We do not track, store, or analyze your specific viewing
                                    habits, content preferences, or streaming history. We respect your entertainment privacy.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: How We Use Your Information */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-3 mb-4">
                            <UserCheck className="text-green-400" size={24} />
                            <h2 className="text-2xl font-bold text-purple-400">2. How We Use Your Information</h2>
                        </div>
                        <div className="text-gray-300 space-y-3">
                            <p>We use the collected information for the following purposes:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li><strong>Service Provision:</strong> To provide and maintain our streaming platform</li>
                                <li><strong>Account Management:</strong> To manage your account and subscription</li>
                                <li><strong>Communication:</strong> To send important updates and support responses</li>
                                <li><strong>Platform Improvement:</strong> To analyze usage patterns and improve our service</li>
                                <li><strong>Security:</strong> To detect and prevent fraudulent or unauthorized access</li>
                                <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                            </ul>
                        </div>
                    </div>

                    {/* Section 3: Information Sharing */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-3 mb-4">
                            <Globe className="text-yellow-400" size={24} />
                            <h2 className="text-2xl font-bold text-purple-400">3. Information Sharing and Disclosure</h2>
                        </div>
                        <div className="text-gray-300 space-y-3">
                            <p className="font-semibold text-green-300">
                                We do not sell, trade, or rent your personal information to third parties.
                            </p>
                            <p>We may share your information only in the following limited circumstances:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li><strong>Payment Processing:</strong> With trusted payment processors for subscription management</li>
                                <li><strong>Service Providers:</strong> With essential service providers who assist in platform operations</li>
                                <li><strong>Legal Requirements:</strong> When required by law or to protect our legal rights</li>
                                <li><strong>Business Transfer:</strong> In the event of a merger or acquisition (with user notification)</li>
                            </ul>
                            <p className="text-sm text-gray-400 mt-4">
                                All third-party services are carefully vetted and bound by strict confidentiality agreements.
                            </p>
                        </div>
                    </div>

                    {/* Section 4: Data Security */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-3 mb-4">
                            <Lock className="text-red-400" size={24} />
                            <h2 className="text-2xl font-bold text-purple-400">4. Data Security</h2>
                        </div>
                        <div className="text-gray-300 space-y-3">
                            <p>
                                We implement appropriate technical and organizational security measures to protect
                                your personal information against unauthorized access, alteration, disclosure, or destruction.
                            </p>
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                                <div className="bg-gray-700/50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-white mb-2">Technical Measures:</h4>
                                    <ul className="text-sm space-y-1">
                                        <li>• SSL/TLS encryption</li>
                                        <li>• Secure server infrastructure</li>
                                        <li>• Regular security updates</li>
                                        <li>• Access logging and monitoring</li>
                                    </ul>
                                </div>
                                <div className="bg-gray-700/50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-white mb-2">Organizational Measures:</h4>
                                    <ul className="text-sm space-y-1">
                                        <li>• Limited access to personal data</li>
                                        <li>• Staff training on privacy practices</li>
                                        <li>• Regular security assessments</li>
                                        <li>• Incident response procedures</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Cookies and Tracking */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-3 mb-4">
                            <AlertCircle className="text-orange-400" size={24} />
                            <h2 className="text-2xl font-bold text-purple-400">5. Cookies and Tracking Technologies</h2>
                        </div>
                        <div className="text-gray-300 space-y-3">
                            <p>We use cookies and similar technologies to enhance your experience:</p>
                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-semibold text-white">Essential Cookies:</h4>
                                    <p className="text-sm">Required for basic platform functionality and security</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">Analytics Cookies:</h4>
                                    <p className="text-sm">Help us understand platform usage and improve performance</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">Preference Cookies:</h4>
                                    <p className="text-sm">Remember your settings and preferences</p>
                                </div>
                            </div>
                            <p className="text-sm">
                                You can control cookie settings through your browser, but disabling certain cookies
                                may affect platform functionality.
                            </p>
                        </div>
                    </div>

                    {/* Section 6: Your Rights */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">6. Your Privacy Rights</h2>
                        <div className="text-gray-300 space-y-3">
                            <p>You have the following rights regarding your personal information:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li><strong>Access:</strong> Request information about data we hold about you</li>
                                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                                <li><strong>Withdrawal:</strong> Withdraw consent for data processing where applicable</li>
                            </ul>
                            <p className="text-sm">
                                To exercise these rights, please contact us through our support channels.
                            </p>
                        </div>
                    </div>

                    {/* Section 7: Data Retention */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">7. Data Retention</h2>
                        <div className="text-gray-300 space-y-3">
                            <p>We retain your personal information only as long as necessary for:</p>
                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Providing our services to you</li>
                                <li>Complying with legal obligations</li>
                                <li>Resolving disputes</li>
                                <li>Enforcing our agreements</li>
                            </ul>
                            <p>
                                Account information is typically deleted within 30 days of account closure.
                                Some information may be retained longer for legal or security purposes.
                            </p>
                        </div>
                    </div>

                    {/* Section 8: Third-Party Links */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">8. Third-Party Links and Content</h2>
                        <div className="text-gray-300 space-y-3">
                            <p>
                                Our platform may contain links to third-party websites or services. We are not
                                responsible for the privacy practices of these external sites.
                            </p>
                            <p>
                                Since we aggregate publicly available streaming content, the actual content streams
                                originate from various external sources. These sources have their own privacy policies
                                and data collection practices.
                            </p>
                            <div className="bg-yellow-600/20 border border-yellow-500/30 p-4 rounded-lg">
                                <p className="text-yellow-200 text-sm">
                                    <strong>Note:</strong> We recommend reviewing the privacy policies of any
                                    third-party services you interact with through our platform.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section 9: Children's Privacy */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">9. Children's Privacy</h2>
                        <div className="text-gray-300 space-y-3">
                            <p>
                                Our service is not intended for children under the age of 13. We do not knowingly
                                collect personal information from children under 13.
                            </p>
                            <p>
                                If we become aware that we have collected personal information from a child under 13,
                                we will take steps to delete such information promptly.
                            </p>
                            <p>
                                Parents and guardians are encouraged to monitor their children's internet usage
                                and help enforce this policy.
                            </p>
                        </div>
                    </div>

                    {/* Section 10: Changes to Privacy Policy */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">10. Changes to This Privacy Policy</h2>
                        <div className="text-gray-300 space-y-3">
                            <p>
                                We may update this Privacy Policy from time to time to reflect changes in our
                                practices or for other operational, legal, or regulatory reasons.
                            </p>
                            <p>
                                When we make significant changes, we will notify users through:
                            </p>
                            <ul className="list-disc list-inside ml-4 space-y-1">
                                <li>Email notification (if you have provided an email address)</li>
                                <li>Prominent notice on our website</li>
                                <li>In-app notification</li>
                            </ul>
                            <p>
                                Your continued use of our service after any changes indicates your acceptance
                                of the updated policy.
                            </p>
                        </div>
                    </div>

                    {/* Section 11: Contact Us */}
                    <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-6 rounded-lg border border-purple-500/30">
                        <h2 className="text-2xl font-bold mb-4 text-purple-400">11. Contact Information</h2>
                        <div className="text-gray-300 space-y-3">
                            <p>
                                If you have any questions about this Privacy Policy or our privacy practices,
                                please contact us:
                            </p>
                            <div className="bg-gray-800/50 p-4 rounded-lg">
                                <h4 className="font-semibold text-white mb-2">Privacy Inquiries:</h4>
                                <ul className="space-y-2 text-sm">
                                    <li>📧 <strong>Email:</strong> privacy@yourplatform.com</li>
                                    <li>📞 <strong>Support:</strong> Use our contact form for privacy-related questions</li>
                                    <li>⏱️ <strong>Response Time:</strong> We aim to respond within 48 hours</li>
                                </ul>
                            </div>
                            <p className="text-sm text-gray-400">
                                For general support inquiries, please use our regular support channels.
                            </p>
                        </div>
                    </div>

                    {/* Last Updated */}
                    <div className="text-center text-gray-400 text-sm mt-12">
                        <p>This Privacy Policy was last updated on January 15, 2025</p>
                        <p className="mt-2">Please review this policy periodically for any updates</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
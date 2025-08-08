import Header from "@/components/Header/Header";
import { Phone, Mail, MapPin, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-900 text-white ">
            <Header />
            <div className="flex items-center justify-center p-6">
                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-800 rounded-2xl shadow-lg p-8">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-white">Get in Touch</h2>
                        <p className="text-gray-300">
                            For any questions regarding your IPTV service, feel free to contact us anytime.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <Phone className="text-primary-500" />
                                <span className="text-gray-200">+8801XXXXXXXXX</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Mail className="text-primary-500" />
                                <span className="text-gray-200">support@iptv.com</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <MapPin className="text-primary-500" />
                                <span className="text-gray-200">Dhaka, Bangladesh</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Name</label>
                            <input
                                type="text"
                                placeholder="Your name"
                                className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Message</label>
                            <textarea
                                rows={4}
                                placeholder="Type your message..."
                                className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full flex justify-center items-center gap-2 bg-primary-500 hover:bg-primary-600 transition-all text-white py-3 px-6 rounded-xl font-semibold border border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 hover:shadow-lg cursor-pointer hover:scale-105"
                        >
                            <Send className="w-5 h-5" />
                            Send Message
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
}

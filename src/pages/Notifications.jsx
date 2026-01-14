import React, { useState } from 'react';
import { Bell, CheckCircle, MessageSquare, Briefcase, Star, X } from 'lucide-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'contract_match',
            title: 'New Contract Match',
            message: 'A new Steel Frame Fabrication contract matches your skills',
            time: '5 minutes ago',
            read: false,
            icon: Briefcase,
        },
        {
            id: 2,
            type: 'application',
            title: 'Application Update',
            message: 'Your application for SS Piping Installation has been shortlisted',
            time: '2 hours ago',
            read: false,
            icon: Star,
        },
        {
            id: 3,
            type: 'message',
            title: 'New Message',
            message: 'BuildTech Solutions sent you a message',
            time: '3 hours ago',
            read: true,
            icon: MessageSquare,
        },
        {
            id: 4,
            type: 'awarded',
            title: 'Contract Awarded!',
            message: 'Congratulations! You have been awarded the Welding Project',
            time: '1 day ago',
            read: true,
            icon: CheckCircle,
        },
        {
            id: 5,
            type: 'application',
            title: 'New Application',
            message: 'Rajesh Kumar applied to your Steel Frame Fabrication contract',
            time: '2 days ago',
            read: true,
            icon: Briefcase,
        },
    ]);

    const [filter, setFilter] = useState('all');

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        );
    };

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter(notif => !notif.read);

    const unreadCount = notifications.filter(n => !n.read).length;

    const getIconColor = (type) => {
        const colors = {
            contract_match: 'text-blue-600 bg-blue-100',
            application: 'text-purple-600 bg-purple-100',
            message: 'text-green-600 bg-green-100',
            awarded: 'text-orange-600 bg-orange-100',
        };
        return colors[type] || colors.contract_match;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Bell className="w-8 h-8" />
                                Notifications
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 font-medium transition-all"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-4 border-t border-gray-200 pt-4">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            All ({notifications.length})
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'unread'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Unread ({unreadCount})
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications.map(notif => (
                            <div
                                key={notif.id}
                                className={`bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg ${!notif.read ? 'border-l-4 border-blue-600' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(notif.type)}`}>
                                        <notif.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="font-bold text-gray-900 mb-1">{notif.title}</h3>
                                                <p className="text-gray-700">{notif.message}</p>
                                            </div>
                                            <button
                                                onClick={() => deleteNotification(notif.id)}
                                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all ml-2"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">{notif.time}</span>
                                            {!notif.read && (
                                                <button
                                                    onClick={() => markAsRead(notif.id)}
                                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No {filter} Notifications</h3>
                            <p className="text-gray-600">You're all caught up!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;

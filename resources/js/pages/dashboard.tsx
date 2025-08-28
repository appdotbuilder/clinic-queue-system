import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        🏥 Clinic Management Dashboard
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Welcome to your clinic management system
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Link
                        href={route('admin.queue')}
                        className="block rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-4xl mb-3">👩‍⚕️</div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    Queue Management
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Manage patient queue and call next patients
                                </p>
                            </div>
                            <div className="text-blue-600 dark:text-blue-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href={route('admin.reports')}
                        className="block rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-4xl mb-3">📊</div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    Reports & Analytics
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    View patient statistics and performance metrics
                                </p>
                            </div>
                            <div className="text-blue-600 dark:text-blue-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href={route('home')}
                        className="block rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-4xl mb-3">🎫</div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    Public Queue
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    View the public patient queue interface
                                </p>
                            </div>
                            <div className="text-blue-600 dark:text-blue-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href={route('queue.display')}
                        className="block rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-4xl mb-3">📺</div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    Display Screen
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Full-screen display for waiting area
                                </p>
                            </div>
                            <div className="text-blue-600 dark:text-blue-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* System Overview */}
                <div className="mt-8 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        🏥 System Features
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="text-center">
                            <div className="text-3xl mb-2">🎯</div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">Digital Queue</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Automatic number generation</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-2">📱</div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">Real-time Updates</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Live status monitoring</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-2">📈</div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">Analytics</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Performance insights</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-2">🔄</div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">Daily Reset</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Fresh start every day</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

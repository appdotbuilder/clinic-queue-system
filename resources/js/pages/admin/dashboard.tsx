import React, { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface QueueItem {
    id: number;
    queue_number: number;
    status: string;
    called_at?: string;
    completed_at?: string;
    called_by_user?: {
        name: string;
    };
    completed_by_user?: {
        name: string;
    };
}

interface Props {
    currentQueue: QueueItem | null;
    waitingQueues: QueueItem[];
    completedQueues: QueueItem[];
    todayTotal: number;
    success?: string;
    [key: string]: unknown;
}

export default function AdminDashboard({ 
    currentQueue, 
    waitingQueues, 
    completedQueues, 
    todayTotal, 
    success 
}: Props) {
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (success) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleCallNext = () => {
        router.patch(route('admin.queue.update'), { action: 'call_next' }, {
            preserveState: false,
            preserveScroll: true
        });
    };

    const handleCompleteCurrent = () => {
        router.patch(route('admin.queue.update'), { action: 'complete_current' }, {
            preserveState: false,
            preserveScroll: true
        });
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AppShell>
            <Head title="Admin Dashboard - Queue Management" />
            
            <div className="p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            👩‍⚕️ Queue Management
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Manage patient queue and track daily progress
                        </p>
                    </div>
                    <Link
                        href={route('admin.reports')}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        📊 View Reports
                    </Link>
                </div>

                {/* Success Message */}
                {showSuccess && (
                    <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                        ✅ {success}
                    </div>
                )}

                {/* Stats Cards */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Total</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{todayTotal}</p>
                            </div>
                            <div className="text-3xl">📊</div>
                        </div>
                    </div>
                    
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Currently Called</p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {currentQueue ? `#${currentQueue.queue_number}` : 'None'}
                                </p>
                            </div>
                            <div className="text-3xl">🔔</div>
                        </div>
                    </div>
                    
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Waiting</p>
                                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{waitingQueues.length}</p>
                            </div>
                            <div className="text-3xl">⏳</div>
                        </div>
                    </div>
                    
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completedQueues.length}</p>
                            </div>
                            <div className="text-3xl">✅</div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mb-8 flex gap-4">
                    <button
                        onClick={handleCallNext}
                        disabled={waitingQueues.length === 0}
                        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        📢 Call Next Queue
                        {waitingQueues.length > 0 && (
                            <span className="rounded bg-white/20 px-2 py-1 text-sm">
                                #{waitingQueues[0].queue_number}
                            </span>
                        )}
                    </button>
                    
                    <button
                        onClick={handleCompleteCurrent}
                        disabled={!currentQueue}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        ✅ Complete Current
                        {currentQueue && (
                            <span className="rounded bg-white/20 px-2 py-1 text-sm">
                                #{currentQueue.queue_number}
                            </span>
                        )}
                    </button>
                </div>

                {/* Queue Lists */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Waiting Queues */}
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                            ⏳ Waiting Queue ({waitingQueues.length})
                        </h2>
                        {waitingQueues.length > 0 ? (
                            <div className="space-y-2">
                                {waitingQueues.slice(0, 10).map((queue) => (
                                    <div
                                        key={queue.id}
                                        className="flex items-center justify-between rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20"
                                    >
                                        <span className="font-semibold text-yellow-800 dark:text-yellow-300">
                                            #{queue.queue_number}
                                        </span>
                                        <span className="text-sm text-yellow-600 dark:text-yellow-400">
                                            Waiting
                                        </span>
                                    </div>
                                ))}
                                {waitingQueues.length > 10 && (
                                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                                        ... and {waitingQueues.length - 10} more
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                No queues waiting
                            </div>
                        )}
                    </div>

                    {/* Completed Queues */}
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                            ✅ Completed Today ({completedQueues.length})
                        </h2>
                        {completedQueues.length > 0 ? (
                            <div className="space-y-2">
                                {completedQueues.slice(0, 10).map((queue) => (
                                    <div
                                        key={queue.id}
                                        className="flex items-center justify-between rounded-lg bg-green-50 p-3 dark:bg-green-900/20"
                                    >
                                        <span className="font-semibold text-green-800 dark:text-green-300">
                                            #{queue.queue_number}
                                        </span>
                                        <div className="text-right text-sm text-green-600 dark:text-green-400">
                                            <div>Completed</div>
                                            <div>{queue.completed_at && formatTime(queue.completed_at)}</div>
                                        </div>
                                    </div>
                                ))}
                                {completedQueues.length > 10 && (
                                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                                        ... and {completedQueues.length - 10} more
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 dark:text-gray-400">
                                No completed queues today
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Link
                        href={route('home')}
                        className="block rounded-lg border border-gray-200 p-4 text-center hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                        <div className="mb-2 text-2xl">🎫</div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">Public Queue</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Patient interface</div>
                    </Link>
                    
                    <Link
                        href={route('queue.display')}
                        className="block rounded-lg border border-gray-200 p-4 text-center hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                        <div className="mb-2 text-2xl">📺</div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">Display Screen</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Public display</div>
                    </Link>
                    
                    <Link
                        href={route('admin.reports')}
                        className="block rounded-lg border border-gray-200 p-4 text-center hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                        <div className="mb-2 text-2xl">📊</div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">Reports</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Analytics & insights</div>
                    </Link>
                </div>
            </div>
        </AppShell>
    );
}
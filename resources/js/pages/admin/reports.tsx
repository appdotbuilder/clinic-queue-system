import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';

interface DailyStats {
    date: string;
    day: string;
    total: number;
    completed: number;
}

interface Stats {
    period: string;
    total: number;
    completed: number;
    waiting?: number;
    called?: number;
    completion_rate: number;
    daily_stats?: DailyStats[];
}

interface Props {
    filter: 'daily' | 'monthly';
    date: string;
    stats: Stats;
    [key: string]: unknown;
}

export default function Reports({ filter, date, stats }: Props) {
    const [selectedFilter, setSelectedFilter] = useState(filter);
    const [selectedDate, setSelectedDate] = useState(date);

    const handleFilterChange = (newFilter: 'daily' | 'monthly', newDate?: string) => {
        const targetDate = newDate || selectedDate;
        setSelectedFilter(newFilter);
        if (newDate) {
            setSelectedDate(newDate);
        }
        
        router.get(route('admin.reports'), {
            filter: newFilter,
            date: targetDate
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleDateChange = (newDate: string) => {
        setSelectedDate(newDate);
        handleFilterChange(selectedFilter, newDate);
    };

    const getCompletionColor = (rate: number) => {
        if (rate >= 90) return 'text-green-600 dark:text-green-400';
        if (rate >= 75) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    return (
        <AppShell>
            <Head title="Reports - Queue Management" />
            
            <div className="p-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            📊 Queue Reports
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Track patient flow and clinic performance
                        </p>
                    </div>
                    <Link
                        href={route('admin.queue')}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        👩‍⚕️ Back to Dashboard
                    </Link>
                </div>

                {/* Filters */}
                <div className="mb-8 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleFilterChange('daily')}
                                className={`rounded-lg px-4 py-2 font-medium ${
                                    selectedFilter === 'daily'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                }`}
                            >
                                📅 Daily
                            </button>
                            <button
                                onClick={() => handleFilterChange('monthly')}
                                className={`rounded-lg px-4 py-2 font-medium ${
                                    selectedFilter === 'monthly'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                }`}
                            >
                                🗓️ Monthly
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <label htmlFor="date" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {selectedFilter === 'daily' ? 'Date:' : 'Month:'}
                            </label>
                            <input
                                type={selectedFilter === 'daily' ? 'date' : 'month'}
                                id="date"
                                value={selectedDate}
                                onChange={(e) => handleDateChange(e.target.value)}
                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700"
                            />
                        </div>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="mb-8">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                        📈 Summary for {stats.period}
                    </h2>
                    
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Patients</p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
                                </div>
                                <div className="text-4xl">👥</div>
                            </div>
                        </div>
                        
                        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
                                </div>
                                <div className="text-4xl">✅</div>
                            </div>
                        </div>
                        
                        {selectedFilter === 'daily' && (
                            <>
                                <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Waiting</p>
                                            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                                                {stats.waiting || 0}
                                            </p>
                                        </div>
                                        <div className="text-4xl">⏳</div>
                                    </div>
                                </div>
                                
                                <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Called</p>
                                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                                {stats.called || 0}
                                            </p>
                                        </div>
                                        <div className="text-4xl">📢</div>
                                    </div>
                                </div>
                            </>
                        )}
                        
                        {selectedFilter === 'monthly' && (
                            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800 sm:col-span-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
                                        <p className={`text-3xl font-bold ${getCompletionColor(stats.completion_rate)}`}>
                                            {stats.completion_rate}%
                                        </p>
                                    </div>
                                    <div className="text-4xl">📊</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Monthly Breakdown */}
                {selectedFilter === 'monthly' && stats.daily_stats && (
                    <div className="mb-8">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                            📅 Daily Breakdown
                        </h2>
                        
                        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                            <div className="grid gap-2 sm:grid-cols-7">
                                {stats.daily_stats.map((day) => (
                                    <div
                                        key={day.date}
                                        className={`rounded-lg p-3 text-center ${
                                            day.total > 0 
                                                ? 'bg-blue-50 dark:bg-blue-900/20' 
                                                : 'bg-gray-50 dark:bg-gray-700'
                                        }`}
                                    >
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {day.day}
                                        </div>
                                        <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                            {day.total}
                                        </div>
                                        <div className="text-xs text-green-600 dark:text-green-400">
                                            {day.completed} done
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Performance Insights */}
                <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
                        💡 Performance Insights
                    </h2>
                    
                    <div className="space-y-4">
                        {stats.completion_rate >= 90 && (
                            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                                <div className="flex items-start gap-3">
                                    <div className="text-2xl">🏆</div>
                                    <div>
                                        <h3 className="font-semibold text-green-800 dark:text-green-300">
                                            Excellent Performance!
                                        </h3>
                                        <p className="text-green-700 dark:text-green-400">
                                            Your completion rate of {stats.completion_rate}% is outstanding. 
                                            Keep up the great work!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {stats.completion_rate < 75 && stats.total > 0 && (
                            <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                                <div className="flex items-start gap-3">
                                    <div className="text-2xl">⚠️</div>
                                    <div>
                                        <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">
                                            Room for Improvement
                                        </h3>
                                        <p className="text-yellow-700 dark:text-yellow-400">
                                            Completion rate is at {stats.completion_rate}%. 
                                            Consider optimizing queue flow to serve more patients.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {stats.total === 0 && (
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                                <div className="flex items-start gap-3">
                                    <div className="text-2xl">📝</div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 dark:text-gray-300">
                                            No Data Available
                                        </h3>
                                        <p className="text-gray-700 dark:text-gray-400">
                                            No queue data found for this period. 
                                            Data will appear once patients start using the system.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
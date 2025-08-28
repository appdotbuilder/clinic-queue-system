import React, { useEffect } from 'react';
import { Head, router } from '@inertiajs/react';

interface Props {
    currentQueue: number | null;
    waitingQueues: number[];
    lastUpdated: string;
    [key: string]: unknown;
}

export default function QueueDisplay({ currentQueue, waitingQueues, lastUpdated }: Props) {
    // Auto-refresh every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            router.get(route('queue.display'), {}, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Head title="Queue Display - Clinic">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-8 text-white">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="mb-2 text-4xl font-bold">🏥 Clinic Queue Display</h1>
                    <p className="text-blue-200">Live Queue Status • Updated: {lastUpdated}</p>
                </div>

                <div className="mx-auto max-w-6xl">
                    {/* Now Calling - Large Display */}
                    <div className="mb-12 rounded-2xl bg-white/10 p-12 text-center backdrop-blur-sm">
                        <h2 className="mb-4 text-3xl font-semibold text-blue-200">NOW CALLING</h2>
                        <div className="text-9xl font-bold">
                            {currentQueue ? (
                                <span className="text-green-400">#{currentQueue}</span>
                            ) : (
                                <span className="text-gray-400">- -</span>
                            )}
                        </div>
                        {currentQueue && (
                            <p className="mt-4 text-2xl text-green-300">Please proceed to the consultation room</p>
                        )}
                    </div>

                    {/* Waiting Queue Numbers */}
                    <div className="grid gap-8 lg:grid-cols-2">
                        <div className="rounded-xl bg-white/10 p-8 backdrop-blur-sm">
                            <h3 className="mb-6 text-2xl font-semibold text-yellow-300">
                                🕐 Waiting Queue ({waitingQueues.length})
                            </h3>
                            {waitingQueues.length > 0 ? (
                                <div className="grid grid-cols-5 gap-3">
                                    {waitingQueues.slice(0, 15).map((queueNum) => (
                                        <div
                                            key={queueNum}
                                            className="rounded-lg bg-yellow-400/20 p-3 text-center text-xl font-semibold"
                                        >
                                            #{queueNum}
                                        </div>
                                    ))}
                                    {waitingQueues.length > 15 && (
                                        <div className="col-span-5 mt-2 text-center text-yellow-300">
                                            ... and {waitingQueues.length - 15} more
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center text-xl text-gray-400">
                                    No one waiting
                                </div>
                            )}
                        </div>

                        {/* Instructions */}
                        <div className="rounded-xl bg-white/10 p-8 backdrop-blur-sm">
                            <h3 className="mb-6 text-2xl font-semibold text-blue-300">
                                📋 Instructions
                            </h3>
                            <div className="space-y-4 text-lg">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">1️⃣</span>
                                    <p>Wait for your number to be called</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">2️⃣</span>
                                    <p>Please be ready when your turn approaches</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">3️⃣</span>
                                    <p>Proceed to the consultation room when called</p>
                                </div>
                                <div className="mt-6 rounded-lg bg-blue-500/20 p-4">
                                    <p className="text-center text-blue-200">
                                        🎫 Need a queue number?<br />
                                        <span className="font-semibold">Visit our registration counter</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-12 text-center">
                        <div className="rounded-xl bg-white/5 p-6 backdrop-blur-sm">
                            <div className="flex items-center justify-center gap-8 text-sm text-blue-200">
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full bg-green-400"></span>
                                    Now Calling
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full bg-yellow-400"></span>
                                    Waiting
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">🔄</span>
                                    Auto-refreshing every 5 seconds
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
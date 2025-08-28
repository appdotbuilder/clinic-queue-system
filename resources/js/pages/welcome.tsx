import React, { useEffect, useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { type SharedData } from '@/types';

interface Props {
    currentQueue: number | null;
    waitingCount: number;
    newQueueNumber?: number;
    success?: string;
    [key: string]: unknown;
}

export default function Welcome({ currentQueue, waitingCount, newQueueNumber, success }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (success || newQueueNumber) {
            setShowSuccess(true);
            const timer = setTimeout(() => setShowSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [success, newQueueNumber]);

    const handleGetQueueNumber = () => {
        router.post(route('queue.store'), {}, {
            preserveState: false,
            preserveScroll: true
        });
    };

    return (
        <>
            <Head title="Patient Queue System">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-blue-50 to-white p-6 text-gray-800 lg:justify-center lg:p-8 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100">
                <header className="mb-8 w-full max-w-4xl">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="text-2xl">🏥</div>
                            <h2 className="text-lg font-semibold">Clinic Queue</h2>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <Link
                                href={route('queue.display')}
                                className="inline-block rounded-lg border border-blue-200 px-4 py-2 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
                            >
                                📺 Display
                            </Link>
                            {auth.user ? (
                                <>
                                    <Link
                                        href={route('admin.queue')}
                                        className="inline-block rounded-lg border border-green-200 px-4 py-2 text-green-600 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20"
                                    >
                                        👩‍⚕️ Admin
                                    </Link>
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-block rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-900/20"
                                    >
                                        Dashboard
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-block rounded-lg border border-transparent px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-block rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-900/20"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <div className="w-full max-w-4xl flex-1">
                    <main className="grid gap-8 lg:grid-cols-2">
                        {/* Get Queue Number Section */}
                        <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                            <div className="text-center">
                                <div className="mb-4 text-6xl">🎫</div>
                                <h1 className="mb-4 text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    Get Your Queue Number
                                </h1>
                                <p className="mb-8 text-lg text-gray-600 dark:text-gray-300">
                                    Click the button below to get your queue number and wait for your turn to be called.
                                </p>
                                
                                {showSuccess && newQueueNumber && (
                                    <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                        <div className="text-4xl font-bold">#{newQueueNumber}</div>
                                        <div className="mt-2">Your queue number</div>
                                        <div className="mt-2 text-sm opacity-80">Please keep this number safe!</div>
                                    </div>
                                )}

                                <button
                                    onClick={handleGetQueueNumber}
                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800"
                                >
                                    <span>🎯</span>
                                    Get Queue Number
                                </button>
                            </div>
                        </div>

                        {/* Current Status Section */}
                        <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                            <div className="text-center">
                                <div className="mb-4 text-6xl">📋</div>
                                <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
                                    Current Status
                                </h2>
                                
                                <div className="space-y-6">
                                    <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                                        <div className="text-sm text-green-600 dark:text-green-400">Now Calling</div>
                                        <div className="text-4xl font-bold text-green-800 dark:text-green-300">
                                            {currentQueue ? `#${currentQueue}` : 'None'}
                                        </div>
                                    </div>
                                    
                                    <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                                        <div className="text-sm text-yellow-600 dark:text-yellow-400">People Waiting</div>
                                        <div className="text-3xl font-bold text-yellow-800 dark:text-yellow-300">
                                            {waitingCount}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                                    Queue numbers reset daily
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* Features Section */}
                    <div className="mt-12 rounded-xl bg-gray-50 p-8 dark:bg-gray-800/50">
                        <h3 className="mb-6 text-center text-2xl font-bold text-gray-800 dark:text-gray-100">
                            How It Works
                        </h3>
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="text-center">
                                <div className="mb-3 text-4xl">1️⃣</div>
                                <h4 className="mb-2 font-semibold">Get Number</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Click to receive your queue number for today
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="mb-3 text-4xl">2️⃣</div>
                                <h4 className="mb-2 font-semibold">Wait Comfortably</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Check the display screen or this page for updates
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="mb-3 text-4xl">3️⃣</div>
                                <h4 className="mb-2 font-semibold">Your Turn</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Come forward when your number is called
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>
                        🏥 Digital Queue Management System • 
                        Built with ❤️ for better patient experience
                    </p>
                </footer>
            </div>
        </>
    );
}
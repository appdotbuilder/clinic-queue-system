<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Queue;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class QueueController extends Controller
{
    /**
     * Display the public queue interface.
     */
    public function index()
    {
        $currentQueue = Queue::getCurrentlyCalledQueue();
        $waitingCount = Queue::today()->waiting()->count();
        
        return Inertia::render('welcome', [
            'currentQueue' => $currentQueue ? $currentQueue->queue_number : null,
            'waitingCount' => $waitingCount,
        ]);
    }

    /**
     * Generate a new queue number for visitor.
     */
    public function store(Request $request)
    {
        $queueNumber = Queue::getNextQueueNumber();
        
        $queue = Queue::create([
            'queue_number' => $queueNumber,
            'queue_date' => today(),
            'status' => 'waiting',
        ]);

        return Inertia::render('welcome', [
            'currentQueue' => Queue::getCurrentlyCalledQueue()?->queue_number,
            'waitingCount' => Queue::today()->waiting()->count(),
            'newQueueNumber' => $queue->queue_number,
            'success' => 'Your queue number has been generated!',
        ]);
    }

    /**
     * Display the public display page.
     */
    public function show()
    {
        $currentQueue = Queue::getCurrentlyCalledQueue();
        $waitingQueues = Queue::today()->waiting()->orderBy('queue_number')->get();
        
        return Inertia::render('queue-display', [
            'currentQueue' => $currentQueue ? $currentQueue->queue_number : null,
            'waitingQueues' => $waitingQueues->pluck('queue_number'),
            'lastUpdated' => now()->format('H:i:s'),
        ]);
    }

    /**
     * Display the admin dashboard.
     */
    public function edit()
    {
        $currentQueue = Queue::getCurrentlyCalledQueue();
        $waitingQueues = Queue::today()->waiting()->orderBy('queue_number')->get();
        $completedQueues = Queue::today()->completed()->orderBy('completed_at', 'desc')->get();
        $todayTotal = Queue::today()->count();

        return Inertia::render('admin/dashboard', [
            'currentQueue' => $currentQueue,
            'waitingQueues' => $waitingQueues,
            'completedQueues' => $completedQueues,
            'todayTotal' => $todayTotal,
        ]);
    }

    /**
     * Call the next queue number.
     */
    public function update(Request $request)
    {
        $action = $request->get('action');

        if ($action === 'call_next') {
            $nextQueue = Queue::today()->waiting()->orderBy('queue_number')->first();
            
            if ($nextQueue) {
                $nextQueue->update([
                    'status' => 'called',
                    'called_at' => now(),
                    'called_by' => auth()->id(),
                ]);
            }
        } elseif ($action === 'complete_current') {
            $currentQueue = Queue::getCurrentlyCalledQueue();
            
            if ($currentQueue) {
                $currentQueue->update([
                    'status' => 'completed',
                    'completed_at' => now(),
                    'completed_by' => auth()->id(),
                ]);
            }
        }

        // Return updated data
        $currentQueue = Queue::getCurrentlyCalledQueue();
        $waitingQueues = Queue::today()->waiting()->orderBy('queue_number')->get();
        $completedQueues = Queue::today()->completed()->orderBy('completed_at', 'desc')->get();
        $todayTotal = Queue::today()->count();

        return Inertia::render('admin/dashboard', [
            'currentQueue' => $currentQueue,
            'waitingQueues' => $waitingQueues,
            'completedQueues' => $completedQueues,
            'todayTotal' => $todayTotal,
            'success' => $action === 'call_next' ? 'Next queue called successfully!' : 'Queue completed successfully!',
        ]);
    }
}
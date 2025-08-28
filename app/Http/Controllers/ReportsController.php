<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Queue;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportsController extends Controller
{
    /**
     * Display the reports page.
     */
    public function index(Request $request)
    {
        $filter = $request->get('filter', 'daily');
        $date = $request->get('date', today()->format('Y-m-d'));
        
        if ($filter === 'daily') {
            $stats = $this->getDailyStats($date);
        } else {
            $stats = $this->getMonthlyStats($date);
        }

        return Inertia::render('admin/reports', [
            'filter' => $filter,
            'date' => $date,
            'stats' => $stats,
        ]);
    }

    /**
     * Get daily statistics.
     */
    protected function getDailyStats($date)
    {
        $targetDate = Carbon::parse($date);
        
        $totalQueues = Queue::whereDate('queue_date', $targetDate)->count();
        $completedQueues = Queue::whereDate('queue_date', $targetDate)->completed()->count();
        $waitingQueues = Queue::whereDate('queue_date', $targetDate)->waiting()->count();
        $calledQueues = Queue::whereDate('queue_date', $targetDate)->called()->count();

        return [
            'period' => $targetDate->format('F j, Y'),
            'total' => $totalQueues,
            'completed' => $completedQueues,
            'waiting' => $waitingQueues,
            'called' => $calledQueues,
            'completion_rate' => $totalQueues > 0 ? round(($completedQueues / $totalQueues) * 100, 1) : 0,
        ];
    }

    /**
     * Get monthly statistics.
     */
    protected function getMonthlyStats($date)
    {
        $targetDate = Carbon::parse($date)->startOfMonth();
        $endDate = $targetDate->copy()->endOfMonth();
        
        $totalQueues = Queue::whereBetween('queue_date', [$targetDate, $endDate])->count();
        $completedQueues = Queue::whereBetween('queue_date', [$targetDate, $endDate])->completed()->count();
        
        // Get daily breakdown for the month
        $dailyStats = [];
        $currentDate = $targetDate->copy();
        
        while ($currentDate <= $endDate) {
            $dayTotal = Queue::whereDate('queue_date', $currentDate)->count();
            $dayCompleted = Queue::whereDate('queue_date', $currentDate)->completed()->count();
            
            $dailyStats[] = [
                'date' => $currentDate->format('Y-m-d'),
                'day' => $currentDate->format('j'),
                'total' => $dayTotal,
                'completed' => $dayCompleted,
            ];
            
            $currentDate->addDay();
        }

        return [
            'period' => $targetDate->format('F Y'),
            'total' => $totalQueues,
            'completed' => $completedQueues,
            'completion_rate' => $totalQueues > 0 ? round(($completedQueues / $totalQueues) * 100, 1) : 0,
            'daily_stats' => $dailyStats,
        ];
    }
}
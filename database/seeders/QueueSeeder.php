<?php

namespace Database\Seeders;

use App\Models\Queue;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class QueueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample data for the past 7 days
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $dailyCount = random_int(5, 25);
            
            for ($j = 1; $j <= $dailyCount; $j++) {
                $status = 'completed';
                
                // Make some queues still waiting or called for today
                if ($i === 0) {
                    if ($j > $dailyCount - 3) {
                        $status = 'waiting';
                    } elseif ($j === $dailyCount - 3) {
                        $status = 'called';
                    }
                }
                
                $queue = Queue::create([
                    'queue_number' => $j,
                    'queue_date' => $date->format('Y-m-d'),
                    'status' => $status,
                ]);
                
                // Set timestamps based on status
                if ($status === 'called' || $status === 'completed') {
                    $queue->update([
                        'called_at' => $date->copy()->addHours(random_int(8, 17))->addMinutes(random_int(0, 59)),
                        'called_by' => 1, // Assuming user with ID 1 exists
                    ]);
                }
                
                if ($status === 'completed') {
                    $queue->update([
                        'completed_at' => $queue->called_at->addMinutes(random_int(10, 45)),
                        'completed_by' => 1,
                    ]);
                }
            }
        }
    }
}
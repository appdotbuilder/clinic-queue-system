<?php

use App\Http\Controllers\QueueController;
use App\Http\Controllers\ReportsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Public queue interface (home page)
Route::controller(QueueController::class)->group(function () {
    Route::get('/', 'index')->name('home');
    Route::post('/', 'store')->name('queue.store');
    Route::get('/display', 'show')->name('queue.display');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Admin queue management
    Route::controller(QueueController::class)->group(function () {
        Route::get('/admin/queue', 'edit')->name('admin.queue');
        Route::patch('/admin/queue', 'update')->name('admin.queue.update');
    });
    
    // Reports
    Route::controller(ReportsController::class)->group(function () {
        Route::get('/admin/reports', 'index')->name('admin.reports');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

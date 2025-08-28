<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('queues', function (Blueprint $table) {
            $table->id();
            $table->integer('queue_number')->comment('The queue number for the day');
            $table->date('queue_date')->comment('The date for this queue number');
            $table->enum('status', ['waiting', 'called', 'completed'])->default('waiting')->comment('Current status of the queue');
            $table->timestamp('called_at')->nullable()->comment('When the queue was called');
            $table->timestamp('completed_at')->nullable()->comment('When the queue was completed');
            $table->foreignId('called_by')->nullable()->constrained('users');
            $table->foreignId('completed_by')->nullable()->constrained('users');
            $table->timestamps();
            
            // Indexes for performance
            $table->unique(['queue_number', 'queue_date']);
            $table->index('queue_date');
            $table->index('status');
            $table->index(['queue_date', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('queues');
    }
};
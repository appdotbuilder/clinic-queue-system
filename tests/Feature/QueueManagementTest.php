<?php

use App\Models\Queue;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('public can view queue interface', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->has('currentQueue')
        ->has('waitingCount')
    );
});

test('visitor can get queue number', function () {
    $response = $this->post('/');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->has('newQueueNumber')
        ->where('newQueueNumber', 1)
    );

    $this->assertDatabaseHas('queues', [
        'queue_number' => 1,
        'queue_date' => today(),
        'status' => 'waiting',
    ]);
});

test('queue numbers increment correctly', function () {
    // Create first queue
    $this->post('/');
    
    // Create second queue
    $response = $this->post('/');

    $response->assertInertia(fn ($page) => $page
        ->where('newQueueNumber', 2)
    );
});

test('queue display shows current status', function () {
    Queue::factory()->today()->called()->create(['queue_number' => 5]);
    Queue::factory()->today()->waiting()->create(['queue_number' => 6]);
    Queue::factory()->today()->waiting()->create(['queue_number' => 7]);

    $response = $this->get('/display');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('queue-display')
        ->where('currentQueue', 5)
        ->where('waitingQueues', [6, 7])
    );
});

test('admin can view dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get('/admin/queue');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('admin/dashboard')
        ->has('currentQueue')
        ->has('waitingQueues')
        ->has('completedQueues')
        ->has('todayTotal')
    );
});

test('admin can call next queue', function () {
    $user = User::factory()->create();
    $this->actingAs($user);
    
    Queue::factory()->today()->waiting()->create(['queue_number' => 1]);
    Queue::factory()->today()->waiting()->create(['queue_number' => 2]);

    $response = $this->patch('/admin/queue', ['action' => 'call_next']);

    $response->assertStatus(200);
    $this->assertDatabaseHas('queues', [
        'queue_number' => 1,
        'status' => 'called',
        'called_by' => $user->id,
    ]);
});

test('admin can complete current queue', function () {
    $user = User::factory()->create();
    $this->actingAs($user);
    
    $queue = Queue::factory()->today()->called()->create(['queue_number' => 1]);

    $response = $this->patch('/admin/queue', ['action' => 'complete_current']);

    $response->assertStatus(200);
    $this->assertDatabaseHas('queues', [
        'queue_number' => 1,
        'status' => 'completed',
        'completed_by' => $user->id,
    ]);
});

test('admin can view reports', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get('/admin/reports');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('admin/reports')
        ->has('filter')
        ->has('date')
        ->has('stats')
    );
});

test('queue model gets next number correctly', function () {
    expect(Queue::getNextQueueNumber())->toBe(1);

    Queue::factory()->today()->create(['queue_number' => 3]);
    Queue::factory()->today()->create(['queue_number' => 1]);

    expect(Queue::getNextQueueNumber())->toBe(4);
});

test('queue model gets currently called queue', function () {
    // Create queues with specific called_at times to ensure ordering
    $queue1 = Queue::factory()->today()->called()->create([
        'queue_number' => 1,
        'called_at' => now()->subMinutes(10)
    ]);
    $queue2 = Queue::factory()->today()->called()->create([
        'queue_number' => 2,
        'called_at' => now()->subMinutes(5)
    ]);

    $currentQueue = Queue::getCurrentlyCalledQueue();
    
    expect($currentQueue->id)->toBe($queue2->id);
});

test('guests cannot access admin areas', function () {
    $this->get('/admin/queue')->assertRedirect('/login');
    $this->get('/admin/reports')->assertRedirect('/login');
    $this->patch('/admin/queue')->assertRedirect('/login');
});
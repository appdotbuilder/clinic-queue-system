<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Queue
 *
 * @property int $id
 * @property int $queue_number
 * @property string $queue_date
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $called_at
 * @property \Illuminate\Support\Carbon|null $completed_at
 * @property int|null $called_by
 * @property int|null $completed_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User|null $calledByUser
 * @property-read \App\Models\User|null $completedByUser
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Queue newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Queue newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Queue query()
 * @method static \Illuminate\Database\Eloquent\Builder|Queue whereCalledAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Queue whereCalledBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Queue whereCompletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Queue whereCompletedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Queue whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Queue whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Queue whereQueueDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Queue whereQueueNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Queue whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Queue whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Queue today()
 * @method static \Illuminate\Database\Eloquent\Builder|Queue waiting()
 * @method static \Illuminate\Database\Eloquent\Builder|Queue called()
 * @method static \Illuminate\Database\Eloquent\Builder|Queue completed()
 * @method static \Database\Factories\QueueFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Queue extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'queue_number',
        'queue_date',
        'status',
        'called_at',
        'completed_at',
        'called_by',
        'completed_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'queue_date' => 'date',
        'called_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the user who called this queue.
     */
    public function calledByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'called_by');
    }

    /**
     * Get the user who completed this queue.
     */
    public function completedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'completed_by');
    }

    /**
     * Scope a query to only include today's queues.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeToday($query)
    {
        return $query->where('queue_date', today());
    }

    /**
     * Scope a query to only include waiting queues.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeWaiting($query)
    {
        return $query->where('status', 'waiting');
    }

    /**
     * Scope a query to only include called queues.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeCalled($query)
    {
        return $query->where('status', 'called');
    }

    /**
     * Scope a query to only include completed queues.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Get the next queue number for today.
     *
     * @return int
     */
    public static function getNextQueueNumber(): int
    {
        $lastQueue = static::today()->orderBy('queue_number', 'desc')->first();
        return $lastQueue ? $lastQueue->queue_number + 1 : 1;
    }

    /**
     * Get the currently called queue for today.
     *
     * @return Queue|null
     */
    public static function getCurrentlyCalledQueue(): ?Queue
    {
        return static::today()->called()->orderBy('called_at', 'desc')->first();
    }
}
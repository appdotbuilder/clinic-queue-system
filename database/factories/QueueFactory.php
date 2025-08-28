<?php

namespace Database\Factories;

use App\Models\Queue;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Queue>
 */
class QueueFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Queue>
     */
    protected $model = Queue::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'queue_number' => $this->faker->numberBetween(1, 100),
            'queue_date' => $this->faker->dateTimeBetween('-7 days', 'now')->format('Y-m-d'),
            'status' => $this->faker->randomElement(['waiting', 'called', 'completed']),
            'called_at' => $this->faker->optional(0.7)->dateTime(),
            'completed_at' => $this->faker->optional(0.5)->dateTime(),
            'called_by' => null,
            'completed_by' => null,
        ];
    }

    /**
     * Indicate that the queue is waiting.
     */
    public function waiting(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'waiting',
            'called_at' => null,
            'completed_at' => null,
            'called_by' => null,
            'completed_by' => null,
        ]);
    }

    /**
     * Indicate that the queue is called.
     */
    public function called(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'called',
            'called_at' => $this->faker->dateTime(),
            'completed_at' => null,
            'completed_by' => null,
        ]);
    }

    /**
     * Indicate that the queue is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'called_at' => $this->faker->dateTime(),
            'completed_at' => $this->faker->dateTime(),
        ]);
    }

    /**
     * Create a queue for today.
     */
    public function today(): static
    {
        return $this->state(fn (array $attributes) => [
            'queue_date' => today(),
        ]);
    }
}
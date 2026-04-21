<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->optional()->paragraph(),
            'status' => $this->faker->randomElement(Task::STATUSES),
            'priority' => $this->faker->randomElement(Task::PRIORITIES),
            'due_date' => $this->faker->optional()->dateTimeBetween('now', '+30 days'),
        ];
    }
}

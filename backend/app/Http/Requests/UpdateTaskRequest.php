<?php

namespace App\Http\Requests;

use App\Models\Task;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'min:3', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'status' => ['sometimes', Rule::in(Task::STATUSES)],
            'priority' => ['sometimes', Rule::in(Task::PRIORITIES)],
            'due_date' => ['nullable', 'date'],
        ];
    }
}

<?php

namespace App\Http\Requests;

use App\Models\Task;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'min:3', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'status' => ['sometimes', Rule::in(Task::STATUSES)],
            'priority' => ['required', Rule::in(Task::PRIORITIES)],
            'due_date' => ['nullable', 'date', 'after_or_equal:today'],
        ];
    }
}

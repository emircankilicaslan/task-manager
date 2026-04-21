<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TaskController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $tasks = $request->user()
            ->tasks()
            ->filter($request->only(['status', 'priority', 'search']))
            ->latest()
            ->paginate(15);

        return TaskResource::collection($tasks);
    }

    public function store(StoreTaskRequest $request): TaskResource
    {
        $task = $request->user()->tasks()->create($request->validated());

        return new TaskResource($task);
    }

    public function show(Task $task): TaskResource
    {
        $this->authorize('view', $task);

        return new TaskResource($task);
    }

    public function update(UpdateTaskRequest $request, Task $task): TaskResource
    {
        $this->authorize('update', $task);

        $task->update($request->validated());

        return new TaskResource($task);
    }

    public function destroy(Task $task): JsonResponse
    {
        $this->authorize('delete', $task);

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully.']);
    }

    public function updateStatus(Request $request, Task $task): TaskResource
    {
        $this->authorize('update', $task);

        $request->validate([
            'status' => ['required', 'in:' . implode(',', Task::STATUSES)],
        ]);

        $task->update(['status' => $request->status]);

        return new TaskResource($task);
    }
}

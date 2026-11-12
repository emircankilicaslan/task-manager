<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TaskTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        Sanctum::actingAs($this->user);
    }

    private function task(array $attrs = [], ?User $owner = null): Task
    {
        return Task::factory()->create(array_merge(['user_id' => ($owner ?? $this->user)->id], $attrs));
    }

    public function test_guests_cannot_access_tasks(): void
    {
        $this->app['auth']->forgetGuards();
        $this->withHeaders(['Authorization' => ''])->getJson('/api/tasks')->assertUnauthorized();
    }

    public function test_create_task(): void
    {
        $this->postJson('/api/tasks', ['title' => 'Rapor yaz', 'priority' => 'high', 'due_date' => now()->addDay()->toDateString()])
            ->assertCreated()
            ->assertJsonPath('data.title', 'Rapor yaz')
            ->assertJsonPath('data.status', 'todo');
        $this->assertDatabaseHas('tasks', ['title' => 'Rapor yaz', 'user_id' => $this->user->id]);
    }

    public function test_create_validates_input(): void
    {
        $this->postJson('/api/tasks', ['title' => 'ab', 'priority' => 'urgent'])
            ->assertUnprocessable()->assertJsonValidationErrors(['title', 'priority']);
        $this->postJson('/api/tasks', ['title' => 'Geçmiş tarih', 'priority' => 'low', 'due_date' => now()->subDays(2)->toDateString()])
            ->assertUnprocessable()->assertJsonValidationErrors('due_date');
    }

    public function test_user_id_in_payload_cannot_assign_task_to_someone_else(): void
    {
        $other = User::factory()->create();

        $this->postJson('/api/tasks', ['title' => 'Mass assignment', 'priority' => 'low', 'user_id' => $other->id])->assertCreated();

        $this->assertDatabaseHas('tasks', ['title' => 'Mass assignment', 'user_id' => $this->user->id]);
    }

    public function test_index_lists_only_own_tasks_with_pagination(): void
    {
        Task::factory()->count(20)->create(['user_id' => $this->user->id]);
        Task::factory()->count(5)->create(); // başka kullanıcılar

        $this->getJson('/api/tasks')
            ->assertOk()
            ->assertJsonCount(15, 'data')
            ->assertJsonPath('meta.total', 20)
            ->assertJsonPath('meta.last_page', 2);
    }

    public function test_index_filters_by_status_priority_and_search(): void
    {
        $this->task(['title' => 'Alışveriş listesi', 'status' => 'todo', 'priority' => 'low']);
        $this->task(['title' => 'Sunum hazırla', 'status' => 'done', 'priority' => 'high']);

        $this->getJson('/api/tasks?status=done')->assertJsonCount(1, 'data')->assertJsonPath('data.0.title', 'Sunum hazırla');
        $this->getJson('/api/tasks?priority=low')->assertJsonCount(1, 'data')->assertJsonPath('data.0.title', 'Alışveriş listesi');
        $this->getJson('/api/tasks?search=sunum')->assertJsonCount(1, 'data');
    }

    public function test_search_treats_wildcards_literally(): void
    {
        $this->task(['title' => 'Normal görev']);
        $this->task(['title' => '100% tamamlandı']);

        $this->getJson('/api/tasks?search=%25')->assertJsonCount(1, 'data')->assertJsonPath('data.0.title', '100% tamamlandı');
    }

    public function test_index_rejects_invalid_filters_instead_of_crashing(): void
    {
        $this->getJson('/api/tasks?search[]=a')->assertUnprocessable()->assertJsonValidationErrors('search');
        $this->getJson('/api/tasks?status=bogus')->assertUnprocessable()->assertJsonValidationErrors('status');
    }

    public function test_show_update_delete_own_task(): void
    {
        $task = $this->task(['title' => 'Eski başlık']);

        $this->getJson("/api/tasks/{$task->id}")->assertOk();
        $this->putJson("/api/tasks/{$task->id}", ['title' => 'Yeni başlık'])->assertOk()->assertJsonPath('data.title', 'Yeni başlık');
        $this->deleteJson("/api/tasks/{$task->id}")->assertOk();
    }

    public function test_delete_is_soft_and_task_becomes_unreachable(): void
    {
        $task = $this->task();

        $this->deleteJson("/api/tasks/{$task->id}")->assertOk();

        $this->assertSoftDeleted('tasks', ['id' => $task->id]);
        $this->getJson("/api/tasks/{$task->id}")->assertNotFound();
        $this->getJson('/api/tasks')->assertJsonCount(0, 'data');
    }

    public function test_other_users_tasks_are_forbidden(): void
    {
        $foreign = $this->task([], User::factory()->create());

        $this->getJson("/api/tasks/{$foreign->id}")->assertForbidden();
        $this->putJson("/api/tasks/{$foreign->id}", ['title' => 'Ele geçir'])->assertForbidden();
        $this->patchJson("/api/tasks/{$foreign->id}/status", ['status' => 'done'])->assertForbidden();
        $this->deleteJson("/api/tasks/{$foreign->id}")->assertForbidden();

        $this->assertDatabaseHas('tasks', ['id' => $foreign->id, 'title' => $foreign->title, 'deleted_at' => null]);
    }

    public function test_update_status_endpoint(): void
    {
        $task = $this->task(['status' => 'todo']);

        $this->patchJson("/api/tasks/{$task->id}/status", ['status' => 'in_progress'])
            ->assertOk()->assertJsonPath('data.status', 'in_progress');
        $this->patchJson("/api/tasks/{$task->id}/status", ['status' => 'bogus'])
            ->assertUnprocessable()->assertJsonValidationErrors('status');
        $this->patchJson("/api/tasks/{$task->id}/status", [])->assertUnprocessable();
    }
}

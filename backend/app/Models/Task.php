<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'status',
        'priority',
        'due_date',
    ];

    // Veritabanı varsayılanıyla uyumlu; oluşturma yanıtında status null dönmesini önler.
    protected $attributes = [
        'status' => 'todo',
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    const STATUSES = ['todo', 'in_progress', 'done'];

    const PRIORITIES = ['low', 'medium', 'high'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeFilter($query, array $filters): void
    {
        $query->when($filters['status'] ?? null, fn ($q, $v) => $q->where('status', $v));
        $query->when($filters['priority'] ?? null, fn ($q, $v) => $q->where('priority', $v));
        // LIKE joker karakterleri (%, _) kullanıcı girdisinde literal sayılır; ESCAPE '!' tüm veritabanlarında çalışır.
        $query->when($filters['search'] ?? null, function ($q, $v) {
            $escaped = str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $v);
            $q->whereRaw("title LIKE ? ESCAPE '!'", ["%{$escaped}%"]);
        });
    }
}

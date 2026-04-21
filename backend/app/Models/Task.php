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
        $query->when($filters['search'] ?? null, fn ($q, $v) => $q->where('title', 'like', "%{$v}%"));
    }
}

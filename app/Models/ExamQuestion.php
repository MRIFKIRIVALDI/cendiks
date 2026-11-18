<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExamQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'certification_exam_id',
        'question_text',
        'code_snippet',
        'points',
        'order',
    ];

    public function certificationExam(): BelongsTo
    {
        return $this->belongsTo(CertificationExam::class);
    }

    public function options(): HasMany
    {
        return $this->hasMany(ExamOption::class)->orderBy('order');
    }
}

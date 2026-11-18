<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('level')->default('pemula'); // pemula | menengah | lanjutan
            $table->string('icon')->nullable(); // emoji or icon name
            $table->string('accent_color')->default('#00FF66');
            $table->integer('duration_minutes')->default(0);
            $table->integer('order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        Schema::create('course_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->longText('content')->nullable(); // markdown content
            $table->longText('code_example')->nullable();
            $table->integer('order')->default(0);
            $table->integer('duration_minutes')->default(0);
            $table->timestamps();
        });

        Schema::create('course_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('course_module_id')->constrained()->cascadeOnDelete();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'course_module_id']);
        });

        Schema::create('certification_exams', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('level')->default('pemula');
            $table->integer('passing_score')->default(70); // percentage
            $table->integer('time_limit_minutes')->default(30);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        Schema::create('exam_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('certification_exam_id')->constrained()->cascadeOnDelete();
            $table->text('question_text');
            $table->longText('code_snippet')->nullable();
            $table->integer('points')->default(10);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        Schema::create('exam_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_question_id')->constrained()->cascadeOnDelete();
            $table->text('option_text');
            $table->boolean('is_correct')->default(false);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        Schema::create('exam_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('certification_exam_id')->constrained()->cascadeOnDelete();
            $table->integer('score')->default(0);
            $table->integer('total_score')->default(0);
            $table->string('status')->default('failed'); // passed | failed
            $table->string('certificate_number')->nullable()->unique();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('finished_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exam_results');
        Schema::dropIfExists('exam_options');
        Schema::dropIfExists('exam_questions');
        Schema::dropIfExists('certification_exams');
        Schema::dropIfExists('course_progress');
        Schema::dropIfExists('course_modules');
        Schema::dropIfExists('courses');
    }
};

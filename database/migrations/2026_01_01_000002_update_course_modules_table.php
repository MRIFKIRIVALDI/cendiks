<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Pastikan kolom code_example ada di course_modules
        if (!Schema::hasColumn('course_modules', 'code_example')) {
            Schema::table('course_modules', function (Blueprint $table) {
                $table->longText('code_example')->nullable();
            });
        }
    }

    public function down(): void
    {
        // nothing
    }
};

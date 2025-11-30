<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->string('gender', 20)->nullable()->after('phone');
            $table->unsignedTinyInteger('age')->nullable()->after('gender');
            $table->string('address')->nullable()->after('age');
            $table->string('role', 20)->default('customer')->after('address');
            $table->string('api_token', 80)->nullable()->unique()->after('role');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'gender',
                'age',
                'address',
                'role',
                'api_token',
            ]);
        });
    }
};



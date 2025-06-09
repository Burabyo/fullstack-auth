<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropDuplicatePersonalAccessTokensTable extends Migration
{
    public function up()
    {
        Schema::dropIfExists('personal_access_tokens_table');
    }

    public function down()
    {
        // Optionally, recreate the table if needed
        Schema::create('personal_access_tokens_table', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->string('token');
            $table->timestamps();
        });
    }
}

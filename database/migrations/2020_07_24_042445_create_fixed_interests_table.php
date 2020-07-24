<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFixedInterestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fixed_interests', function (Blueprint $table) {
            $table->id();
            $table->text('name');
            $table->decimal('rate', 10, 2);
            $table->integer('deadline');
            $table->decimal('amount', 10, 2);
            $table->date('start_date');
            $table->date('expiration_date');
            $table->decimal('gross_return', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fixed_interests');
    }
}

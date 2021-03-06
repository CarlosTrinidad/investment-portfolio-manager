<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePurchasesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('purchases', function (Blueprint $table) {
            $table->increments('id');
            $table->text('name');
            $table->string('symbol', 100);
            $table->text('description')->nullable();
            $table->integer('shares');
            $table->decimal('buy_price', 10, 2);
            $table->date('purchase_date');
            $table->timestamps();
            // TODO: Uncomment when login is
            // $table->biginteger('user_id')->unsigned(); 
            // $table->foreign('user_id')->references('id')->on('users'); 
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('purchases');
    }
}

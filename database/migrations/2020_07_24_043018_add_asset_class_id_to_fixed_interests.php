<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAssetClassIdToFixedInterests extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('fixed_interests', function (Blueprint $table) {
            $table->integer('asset_class_id')->unsigned()->nullable()->after("gross_return");
            $table->foreign("asset_class_id")->references("id")->on("asset_classes");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('fixed_interests', function (Blueprint $table) {
            $table->dropForeign(["asset_class_id"]);
            $table->dropColumn("asset_class_id");
        });
    }
}

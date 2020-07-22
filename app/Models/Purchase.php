<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use eloquentFilter\QueryFilter\ModelFilters\Filterable;

class Purchase extends Model
{
    use Filterable;

    protected $fillable = [
        'name',
        'symbol',
        'description',
        'shares',
        'buy_price',
        'purchase_date',
        'asset_class_id'
    ];

    private static $whiteListFilter = ['*'];


    // public function user(){
    //     return $this->belongsTo('App\Models\User');
    // }
    public function assetClass(){
        return $this->belongsTo('App\Models\AssetClass');
    }

}

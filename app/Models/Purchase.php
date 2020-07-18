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
        'purchase_date'
    ];

    private static $whiteListFilter = ['*'];


    // public function user(){
    //     return $this->belongsTo('App\Models\User');
    // }

}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
       protected $fillable = [
        'name',
        'symbol',
        'description',
        'shares',
        'buy_price',
        'purchase_date'
    ];

    // public function user(){
    //     return $this->belongsTo('App\Models\User');
    // }
    
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use eloquentFilter\QueryFilter\ModelFilters\Filterable;


class FixedInterest extends Model
{
    use Filterable;

    protected $fillable = [
        'name',
        'rate',
        'deadline',
        'amount',
        'start_date',
        'expiration_date',
        'gross_return',
        'asset_class_id'
    ];

    private static $whiteListFilter = ['*'];


    public function assetClass()
    {
        return $this->belongsTo('App\Models\AssetClass');
    }
}

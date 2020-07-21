<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use eloquentFilter\QueryFilter\ModelFilters\Filterable;

class AssetClass extends Model
{
    use Filterable;

    protected $fillable = [
        'name',
    ];

    private static $whiteListFilter = ['*'];

    public function purchases(){
        return $this->hasMany("App\Models\Purchases");
    }
}

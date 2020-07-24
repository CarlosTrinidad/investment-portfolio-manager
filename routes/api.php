<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('purchases', 'PurchaseController@index');
Route::get('purchases/grouped', 'PurchaseController@grouped');
Route::get('purchases/{purchase}', 'PurchaseController@show');
Route::post('purchases', 'PurchaseController@store');
Route::put('purchases/{purchase}', 'PurchaseController@update');
Route::delete('purchases/{purchase}', 'PurchaseController@delete');

Route::get('asset-classes', 'AssetClassController@index');
Route::get('asset-classes/{assetClass}', 'AssetClassController@show');
Route::post('asset-classes', 'AssetClassController@store');
Route::put('asset-classes/{assetClass}', 'AssetClassController@update');
Route::delete('asset-classes/{assetClass}', 'AssetClassController@delete');

Route::get('fixed-interest', 'FixedInterestController@index');
Route::get('fixed-interest/{fixedInsterest}', 'FixedInterestController@show');
Route::post('fixed-interest', 'FixedInterestController@store');
Route::put('fixed-interest/{fixedInsterest}', 'FixedInterestController@update');
Route::delete('fixed-interest/{fixedInsterest}', 'FixedInterestController@delete');

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AssetClass;

class AssetClassController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return AssetClass::filter()->orderBy('name', 'asc')->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $assetClass = AssetClass::create($request->all());
        return response()->json($assetClass, 201);

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\AssetClass  $assetClass
     * @return \Illuminate\Http\Response
     */
    public function show(AssetClass $assetClass)
    {
        return $assetClass;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\AssetClass  $assetClass
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, AssetClass $assetClass)
    {
        $assetClass->update($request->all());

        return response()->json($assetClass, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\AssetClass  $assetClass
     * @return \Illuminate\Http\Response
     */
    public function destroy($assetClass)
    {
        $assetClass->delete();
        return response()->json(null, 204);

    }
}

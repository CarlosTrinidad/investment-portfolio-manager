<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FixedInterest;


class FixedInterestController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $fixedInterest = FixedInterest::filter()->orderBy('expiration_date', 'asc')->with("assetClass")->get();
        return $fixedInterest;
    }


    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $fixedInsterest = FixedInterest::create($request->all());

        return response()->json($fixedInsterest, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  App\Models\FixedInterest  $fixedInsterest
     * @return \Illuminate\Http\Response
     */
    public function show(FixedInterest $fixedInsterest)
    {
        return $fixedInsterest;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  App\Models\FixedInterest  $fixedInsterest
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, FixedInterest $fixedInsterest)
    {
        $fixedInsterest->update($request->all());
        return response()->json($fixedInsterest, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  App\Models\FixedInterest  $fixedInsterest
     * @return \Illuminate\Http\Response
     */
    public function delete(FixedInterest $fixedInsterest)
    {
        $fixedInsterest->delete();

        return response()->json(null, 204);
    }
}

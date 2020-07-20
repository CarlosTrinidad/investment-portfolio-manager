<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Purchase;

class PurchaseController extends Controller
{

    /**
     * List all purchases
     */
    public function index(Request $request)
    {
        $purchases = Purchase::filter()->orderBy('name', 'asc')->get();
        return $purchases;
    }

    /**
     * List all purchases
     */
    public function grouped()
    {
        // return Purchase::all();

        return Purchase::selectRaw('purchases.*, SUM(shares) total_shares, SUM(shares*buy_price)/ SUM(shares) average_buy_price')
            ->orderBy('name', 'asc')
            ->groupBy('symbol')
            ->get();
    }

    /**
     * Show a specific pruchase 
     */
    public function show(Purchase $purchase)
    {
        return $purchase;
    }

    /**
     * Creates a purchase
     */
    public function store(Request $request)
    {
        $purchase = Purchase::create($request->all());

        return response()->json($purchase, 201);
    }

    /**
     * Updates a purchase
     */
    public function update(Request $request, Purchase $purchase)
    {
        $purchase->update($request->all());

        return response()->json($purchase, 200);
    }

    /**
     * Deletes a purchase
     */
    public function delete(Purchase $purchase)
    {
        $purchase->delete();

        return response()->json(null, 204);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Personalize;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category' => 'required',
            'source' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = request()->only('category','source');

        $personalize = Personalize::updateOrCreate([
            'category' => $data['category'],
            'source' => $data['source'],
            'user_id' => auth()->id()
        ]);

        if($personalize) {
            return response()->json([
                'success' => true,
                'personalize'    => $personalize,  
            ], 201);
        }

        return response()->json([
            'success' => false,
        ], 409);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $validator = Validator::make($request->all(), [
            'category' => 'required',
            'source' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = request()->only('category','source');

        $personalize = Personalize::where([
            'category' => $data['category'],
            'source' => $data['source'],
            'user_id' => auth()->id()
        ]);


        if($personalize) {
            return response()->json([
                'success' => true,
                'personalize' => $personalize,
            ], 201);
        }

        return response()->json([
            'success' => false,
        ], 409);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'category' => 'required',
            'source' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = request()->only('category','source');

        $personalize = Personalize::updateOrCreate([
            'category' => $data['category'],
            'source' => $data['source'],
            'user_id' => auth()->id()
        ]);

        if($personalize) {
            return response()->json([
                'success' => true,
                'personalize'    => $personalize,  
            ], 201);
        }

        return response()->json([
            'success' => false,
        ], 409);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

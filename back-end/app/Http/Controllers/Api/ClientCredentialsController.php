<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ClientCredentialsController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $response = Http::asForm()->post('http://172.25.128.1:8000/oauth/token', [
            'grant_type' => 'client_credentials',
            'client_id' => env('PASSPORT_CREDENTIALS_CLIENT_ID'),
            'client_secret' => env('PASSPORT_CREDENTIALS_CLIENT_SECRET'),
            'scope' => '',
        ]);

         
        return $response->json();
    }
}

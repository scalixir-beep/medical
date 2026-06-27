<?php

namespace App\Http\Controllers;

use App\Models\ConnexionLog;

class ConnexionController extends Controller
{
    public function index()
    {
        return response()->json(
            ConnexionLog::orderByDesc('id')->limit(200)->get()
        );
    }
}

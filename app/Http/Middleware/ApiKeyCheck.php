<?php

namespace App\Http\Middleware;


use App\Models\User;
use Closure;
use Illuminate\Http\Request;

class ApiKeyCheck
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle($request, Closure $next)
    {
        $apiKey = $request->header('API-Key');
    
        if (!$apiKey || !User::where('api_key', $apiKey)->exists()) {
            return response()->json(['message' => 'Invalid API Key'], 401);
        }
    
        return $next($request);
    }
}
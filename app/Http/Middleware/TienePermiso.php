<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use App\Models\Permisos_rol;

class TienePermiso
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {

        $user = Auth::user();
        $permisos = Permisos_rol::join('permisos', 'permisos_rols.permiso_id', '=', 'permisos.id')
            ->where('permisos_rols.rol_id', $user->rol_id)
            ->select('permisos.name', 'permisos_rols.permiso_id')
            ->get();
        $url = explode('/', $request->url());
        $url = array_slice($url, 3);

        if ($url[0] == 'api') {
            array_shift($url);
        }

        if (count($url) === 0) {
            return $next($request);
        }

        switch ($url[0]) {
            case 'registro':
            case 'user':
            case 'modelo':
                return $next($request);
                break;
            case 'admin':
            case 'current_data':
            case 'turnos':
                if (in_array('configuracion', $permisos->pluck('name')->toArray())) {
                    return $next($request); 
                }
                break;
            case 'panel':
                if (in_array('panel general', $permisos->pluck('name')->toArray())) {
                    return $next($request);
                }
                break;
            case 'panel_maquina':
                if (in_array('panel maquina', $permisos->pluck('name')->toArray())) {
                    return $next($request);
                }
                break;
            case 'entrada':
                if (in_array('entrada manual', $permisos->pluck('name')->toArray())) {
                    return $next($request);
                }
                break;
            case 'ofs':
            case 'of':
                if (in_array('ordenes de fabricacion', $permisos->pluck('name')->toArray())) {
                    return $next($request);
                }
                break;
            case 'notificaciones':
                if (in_array('alarmas', $permisos->pluck('name')->toArray())) {
                    return $next($request);
                }
                break;
            default:
                if (in_array($url[0], $permisos->pluck('name')->toArray())) {
                    return $next($request);
                }
                break;
        }

        return response()->json(['message' => 'No tienes permiso para acceder a esta sección'], 401);
    }
}

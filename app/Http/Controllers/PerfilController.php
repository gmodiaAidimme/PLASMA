<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Empresa;
use App\Models\Permisos_rol;

use Intervention\Image\Facades\Image;

class PerfilController extends Controller
{
    public function getPerfil(){
        $user = Auth::user();
        $permisos = Permisos_rol::join('permisos', 'permisos_rols.permiso_id', '=', 'permisos.id')
            ->where('permisos_rols.rol_id', $user->rol_id)
            ->select('permisos.name', 'permisos_rols.permiso_id')
            ->get();
        $empresa = Empresa::first();
        return response()->json([
            'user' => $user,
            'empresa' => $empresa,
            'permisos' => $permisos
        ], 200);
    }

    public function changeAvatar(Request $request){

        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg',
        ]);
        
        $imageName = time().'.'.$request->avatar->extension();  

        $image = Image::make($request->avatar->path());

        $width = $image->width();
        $height = $image->height();

        if($width > $height){
            $diferencia = $width - $height;
            $image->crop($height, $height, intval($diferencia/2), 0);

        }else if($height > $width){
            $diferencia = $height - $width;
            $image->crop($width, $width, 0, intval($diferencia/2));
        }

        $image->resize(150, 150, function ($constraint) {
            $constraint->aspectRatio();
        });

        $image->save(public_path('images/user/'.$imageName));
      
        $user = Auth::user();
        $user->avatar = "user/".$imageName;
        $user->save();
        return response()->json([
            'avatar' => $user->avatar
        ], 200);
    }

    public function generarApiKey(){
        $user = Auth::user();
        $user->api_key = bin2hex(openssl_random_pseudo_bytes(30));
        $user->save();
        return response()->json([
            'api_key' => $user->api_key
        ], 200);
    }

    public function destruirApiKey(){
        $user = Auth::user();
        $user->api_key = null;
        $user->save();
        return response()->json([
            'api_key' => $user->api_key
        ], 200);
    }

    public function getDatosEmpresa(){
        $empresa = Empresa::first();
        return response()->json([
            'nombre' => $empresa->nombre,
            'logo' => $empresa->logo
        ], 200);
    }

}

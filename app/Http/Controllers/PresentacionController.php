<?php

namespace App\Http\Controllers;

use App\Models\Maquina;
use App\Models\User;
use App\Models\Vista;
use App\Models\Visual;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use Laravel\Sanctum\Sanctum;

class PresentacionController extends Controller
{
    public function getVistas()
    {
        $vistas = Vista::with('visuales')->get();
        return response()->json($vistas, 200);
    }

    public function getVista($id)
    {

        $validator = Validator::make(['id' => $id], [
            'id' => 'required|numeric|min:1', // validate the 'id' parameter
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $vista = Vista::with('visuales')->find($id);
        foreach ($vista->visuales as $visual) {
            if ($visual->maquina_id == 0) {
                $visual->nombre_maquina = 'General';
                $visual->abreviacion_maquina = 'GNR';
            } else {
                $visual->nombre_maquina = Maquina::find($visual->maquina_id)->nombre;
                $visual->abreviacion_maquina = Maquina::find($visual->maquina_id)->abreviacion;
            }
        }

        return response()->json($vista, 200);
    }

    public function postVista(Request $request)
    {

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string|max:255',
            'visuales' => 'required|array|min:1',
            'visuales.*.maquina' => 'required|numeric|min:1',
            'visuales.*.tipo_visual' => 'required|string|max:255',
            'visuales.*.ancho' => 'required|numeric|min:1',
            'visuales.*.alto' => 'required|numeric|min:1',
            'visuales.*.x' => 'required|numeric|min:0',
            'visuales.*.y' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $vista = Vista::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion
        ]);

        foreach ($request->visuales as $visual) {
            Visual::create([
                'vista_id' => $vista->id,
                'maquina_id' => $visual["maquina"],
                'tipo' => $visual["tipo_visual"],
                'ancho' => $visual["ancho"],
                'alto' => $visual["alto"],
                'x' => $visual["x"],
                'y' => $visual["y"],
            ]);
        }

        return response()->json(['message' => 'Vista creada correctamente'], 200);
    }

    public function putVista(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|numeric|min:1',
            'nombre' => 'required|max:255',
            'descripcion' => 'nullable|max:255',
            'visuales' => 'required|array|min:1',
            'visuales.*.maquina' => 'required|numeric|min:1',
            'visuales.*.tipo_visual' => 'required|string|max:255',
            'visuales.*.ancho' => 'required|numeric|min:1',
            'visuales.*.alto' => 'required|numeric|min:1',
            'visuales.*.x' => 'required|numeric|min:0',
            'visuales.*.y' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $vista = Vista::find($request->id);
        $vista->nombre = $request->nombre;
        $vista->descripcion = $request->descripcion;
        $vista->save();

        $vista->visuales()->delete();

        foreach ($request->visuales as $visual) {
            Visual::create([
                'vista_id' => $vista->id,
                'maquina_id' => $visual["maquina"],
                'tipo' => $visual["tipo_visual"],
                'ancho' => $visual["ancho"],
                'alto' => $visual["alto"],
                'x' => $visual["x"],
                'y' => $visual["y"],
            ]);
        }

        return response()->json(['message' => 'Vista actualizada correctamente'], 200);
    }

    public function deleteVista($id)
    {

        $validator = Validator::make(['id' => $id], [
            'id' => 'required|numeric|min:1', // validate the 'id' parameter
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $visuales = Visual::where('vista_id', $id)->get();
        foreach ($visuales as $visual) {
            $visual->delete();
        }
        $vista = Vista::find($id);
        $vista->delete();
        return response()->json(['message' => 'Vista eliminada correctamente'], 200);
    }

}

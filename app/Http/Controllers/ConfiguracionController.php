<?php

namespace App\Http\Controllers;

use App\Models\Alarma;
use Illuminate\Http\Request;
use App\Models\Maquina;
use App\Models\Empleado;
use App\Models\Parada;
use App\Models\Estado;
use App\Models\Defecto;
use App\Models\Entrada;
use App\Models\Sensor;
use App\Models\Horario;
use App\Models\Orden;
use App\Models\Permisos_rol;
use App\Models\Variable;
use App\Models\User;
use App\Models\Receptor;
use App\Models\Rol;
use App\Models\Producto;
use App\Models\Permiso;
use App\Models\Producto_maquina;
use App\Models\Rendimiento_en_maquina_por_operarios;
use App\Models\Motivos_presencia;
use Illuminate\Support\Facades\Validator;

use Intervention\Image\Facades\Image;

class ConfiguracionController extends Controller
{

    private function createModel($model)
    {
        switch ($model) {
            case 'maquina':
                return new Maquina();
            case 'empleado':
                return new Empleado();
            case 'parada':
                return new Parada();
            case 'estado':
                return new Estado();
            case 'defecto':
                return new Defecto();
            case 'motivos_presencia':
                return new Motivos_presencia();
            case 'entrada':
                return new Entrada();
            case 'sensor':
                return new Sensor();
            case 'alarma':
                return new Alarma();
            case 'receptor':
                return new Receptor();
            case 'rendimiento_en_maquina_por_operario':
                return new Rendimiento_en_maquina_por_operarios();
            case 'producto':
                return new Producto();
            case 'producto_maquina':
                return new Producto_maquina();
            case 'user':
                return new User();
        }
    }

    private function getTipos($modelo)
    {
        switch ($modelo) {
            case 'maquina':
                return [
                    ["nombre" => "nombre",                   "tipo" => "text"],
                    ["nombre" => "imagen",                   "tipo" => "image"],
                    ["nombre" => "abreviacion",              "tipo" => "text"],
                    ["nombre" => "tiempo_ciclo_defecto",     "tipo" => "number"],
                    ["nombre" => "color",                    "tipo" => "color"],
                    ["nombre" => "final",                    "tipo" => "select", "opciones" => [
                        ["id" => 0, "nombre" => "Intermedia"],
                        ["id" => 1, "nombre" => "Final"]
                    ]],
                    ["nombre" => "tipo_calculo_rendimiento", "tipo" => "select", "opciones" => [
                        [
                            "id" => "basico",
                            "nombre" => "Básico"
                        ],
                        [
                            "id" => "por_operario",
                            "nombre" => "Por operario"
                        ]
                    ]]
                ];
            case 'empleado':
                return [
                    ["nombre" => "nombre",               "tipo" => "text"],
                    ["nombre" => "apellido",             "tipo" => "text"],
                    ["nombre" => "email",                "tipo" => "email"],
                    [
                        "nombre" => "posicion",          "tipo" => "select", "opciones" => [
                            [
                                "id" => "Operario",
                                "nombre" => "Operario"
                            ],
                            [
                                "id" => "Gerente",
                                "nombre" => "Gerente"
                            ],
                            [
                                "id" => "Supervisor",
                                "nombre" => "Supervisor"
                            ]
                        ]
                    ],
                    ["nombre" => "imagen",               "tipo" => "image"]
                ];
            case 'parada':
                return [
                    ["nombre" => "nombre",             "tipo" => "text"],
                    ["nombre" => "inicio",             "tipo" => "time"],
                    ["nombre" => "fin",                "tipo" => "time"],
                    ["nombre" => "lunes",              "tipo" => "checkbox"],
                    ["nombre" => "martes",             "tipo" => "checkbox"],
                    ["nombre" => "miercoles",          "tipo" => "checkbox"],
                    ["nombre" => "jueves",             "tipo" => "checkbox"],
                    ["nombre" => "viernes",            "tipo" => "checkbox"],
                    ["nombre" => "sabado",             "tipo" => "checkbox"],
                    ["nombre" => "domingo",            "tipo" => "checkbox"],
                ];
            case 'estado':
            case 'defecto':
            case 'motivos_presencia':
                return [
                    ["nombre" => "nombre",             "tipo" => "text"],
                    ["nombre" => "descripcion",        "tipo" => "text"],
                    ["nombre" => "color",              "tipo" => "color"]
                ];
            case 'entrada':
            case 'sensor':
                return [
                    ["nombre" => "nombre",  "tipo" => "text"],
                    ["nombre" => "unidades", "tipo" => "text"],
                    ["nombre" => "maquina_id", "tipo" => "select", "opciones" => Maquina::all()]
                ];
            case 'alarma':
                return [
                    ["nombre" => "maquina_id", "tipo" => "select", "opciones" => Maquina::all()],
                    ["nombre" => "magnitud", "tipo" => "select", "opciones" => [['id' => "disponibilidad", 'nombre' => "Disponibilidad"], ['id' => "rendimiento", 'nombre' => "Rendimiento"], ['id' => "calidad", 'nombre' => "Calidad"], ['id' => 'oee', 'nombre' => 'oee']]],
                    ["nombre" => "valor", "tipo" => "number"]
                ];
            case 'receptor':
                return [
                    ["nombre" => "email", "tipo" => "text"]
                ];
            case 'rendimiento_en_maquina_por_operario':
                return [
                    ["nombre" => "maquina_id", "tipo" => "select", "opciones" => Maquina::all()],
                    ["nombre" => "numero_operarios", "tipo" => "number"],
                    ["nombre" => "rendimiento_teorico", "tipo" => "number"]
                ];
            case 'rol':
                return [
                    ["nombre" => "name", "tipo" => "text"],
                    ["nombre" => "description", "tipo" => "text"],
                ];
            case 'producto':
                return [
                    ["nombre" => "nombre", "tipo" => "text"],
                    ["nombre" => "descripcion", "tipo" => "text"],
                    ["nombre" => "imagen", "tipo" => "image"]
                ];
            case 'producto_maquina':
                return [
                    ["nombre" => "maquina_id", "tipo" => "select", "opciones" => Maquina::all()],
                    ["nombre" => "producto_id", "tipo" => "select", "opciones" => Producto::all()],
                ];
            case 'user':
                return [
                    ["nombre" => "name", "tipo" => "text"],
                    ["nombre" => "avatar", "tipo" => "image"],
                    ["nombre" => "email", "tipo" => "email"],
                    ["nombre" => "password", "tipo" => "password"],
                    ["nombre" => "rol_id", "tipo" => "select", "opciones" => Rol::select(['id', 'name as nombre'])->get()],
                    [
                        "nombre" => "estado", "tipo" => "select", "opciones" => [['id' => "Activo", 'nombre' => "Activo"], ['id' => "Desactivado", 'nombre' => "Desactivado"]]
                    ]
                ];
        }
    }

    private function findModel($modelo, $id)
    {
        switch ($modelo) {
            case 'maquina':
                return Maquina::find($id);
            case 'empleado':
                return Empleado::find($id);
            case 'parada':
                return Parada::find($id);
            case 'estado':
                return Estado::find($id);
            case 'defecto':
                return Defecto::find($id);
            case 'motivos_presencia':
                return Motivos_presencia::find($id);
            case 'entrada':
                return Entrada::find($id);
            case 'sensor':
                return Sensor::find($id);
            case 'alarma':
                return Alarma::find($id);
            case 'receptor':
                return Receptor::find($id);
            case 'rendimiento_en_maquina_por_operario':
                return Rendimiento_en_maquina_por_operarios::find($id);
            case 'producto':
                return Producto::find($id);
            case 'producto_maquina':
                return Producto_maquina::find($id);
            case 'user':
                return User::find($id);
        }
    }

    public function getModelo($modelo)
    {
        $validation = Validator::make(['modelo' => $modelo], [
            'modelo' => 'required|in:user,maquina,rol,empleado,parada,estado,motivos_presencia,defecto,entrada,sensor,of,alarma,receptor,rendimiento_en_maquina_por_operario,producto,producto_maquina'
        ]);

        if ($validation->fails()) {
            return response()->json(['errors' => $validation->errors()], 400);
        }

        $datos = [];

        switch ($modelo) {
            case 'maquina':
                $datos = Maquina::all();
                foreach ($datos as $maquina) {
                    $maquina["final"] = ($maquina->final == 0 ? "Intermedia" : "final");
                }
                break;
            case 'empleado':
                $datos = Empleado::all();
                break;
            case 'parada':
                $datos = Parada::all();
                break;
            case 'estado':
                $datos = Estado::all();
                break;
            case 'defecto':
                $datos = Defecto::all();
                break;
            case 'motivos_presencia':
                $datos = Motivos_presencia::all();
                break;
            case 'entrada':
                $datos = Entrada::all();
                break;
            case 'sensor':
                $datos = Sensor::all();
                break;
            case 'of':
                $datos = Orden::all();
                break;
            case 'alarma':
                $datos = Alarma::all();
                break;
            case 'receptor':
                $datos = Receptor::all();
                break;
            case 'rendimiento_en_maquina_por_operario':
                $datos = Rendimiento_en_maquina_por_operarios::all();
                break;
            case 'rol':
                $datos = Rol::all();
                break;
            case 'producto':
                $datos = Producto::all();
                break;
            case 'producto_maquina':
                $datos = Producto_maquina::join('productos', 'productos.id', '=', 'producto_maquinas.producto_id')
                    ->join('maquinas', 'maquinas.id', '=', 'producto_maquinas.maquina_id')
                    ->select(['producto_maquinas.id', 'productos.nombre as producto', 'maquinas.nombre as maquina'])
                    ->get();
                break;
            case 'user':
                $datos = User::join('rols', 'rols.id', '=', 'users.rol_id')
                    ->select(['users.id', 'users.name', 'users.email', 'users.estado', 'users.created_at', 'users.avatar', 'rols.name as rol'])
                    ->get();
                foreach ($datos as $user) {
                    if ($user->google_id) {
                        $user["tipo_registro"] = "google";
                    } else {
                        $user["tipo_registro"] = "email";
                    }

                    $user["fecha_registro"] = $user->created_at->format('d/m/Y');
                }
                break;
        }
        return json_encode(['modelo' => $modelo, 'datos' => $datos]);
    }

    public function deleteModelo($modelo, $id)
    {
        $validation = Validator::make(['modelo' => $modelo, 'id' => $id], [
            'modelo' => 'required|in:user,maquina,empleado,parada,estado,defecto,motivos_presencia,entrada,sensor,alarma,receptor,rendimiento_en_maquina_por_operario,producto,producto_maquina',
            'id' => [
                'required',
                'integer',
            ]
        ]);

        if ($validation->fails()) {
            return response()->json(['errors' => $validation->errors()], 400);
        }

        $model = $this->findModel($modelo, $id);
        if ($model == null) {
            return response()->json(['errors' => ['id' => 'El id no existe']], 400);
        }
        $model->delete();
        return response()->json(['resultado' => 'Eliminado']);
    }

    public function getCurrentData($modelo, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'sometimes|exists:' . $modelo . 's,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = [];
        $data["tipos"] = $this->getTipos($modelo);
        if ($request->has('id')) {
            $data["datos"] = $this->findModel($modelo, $request->id)->toArray();
        }
        return $data;
    }

    public function postModelo($modelo, Request $request)
    {
        $tipos = $this->getTipos($modelo);
        $mod = $this->createModel($modelo);

        foreach ($tipos as $tipo) {
            if ($request->has($tipo["nombre"])) {
                if ($tipo["tipo"] == "image") {
                    $imageName = time() . '.' . $request[$tipo["nombre"]]->extension();

                    $image = Image::make($request[$tipo["nombre"]]->path());

                    $width = $image->width();
                    $height = $image->height();

                    if ($width > $height) {
                        $diferencia = $width - $height;
                        $image->crop($height, $height, intval($diferencia / 2), 0);
                    } else if ($height > $width) {
                        $diferencia = $height - $width;
                        $image->crop($width, $width, 0, intval($diferencia / 2));
                    }

                    $image->save(public_path('images/' . $modelo . '/' . $imageName));

                    $mod[$tipo['nombre']] = $modelo . '/' . $imageName;

                    $image->resize(70, 70, function ($constraint) {
                        $constraint->aspectRatio();
                    });

                    $image->save(public_path('images/' . $modelo . '/mini-' . $imageName));
                } else {
                    $mod[$tipo['nombre']] = $request[$tipo['nombre']];
                }
            }
        }
        $mod->save();
        return response("creado", 201);
    }

    public function putModelo($modelo, Request $request)
    {
        $validator = Validator::make(['id' => $request->id, 'modelo' => $modelo], [
            'id' => 'required|exists:' . $modelo . 's,id',
            'modelo' => 'required|in:user,maquina,empleado,parada,estado,defecto,motivos_presencia,entrada,sensor,alarma,receptor,rendimiento_en_maquina_por_operario,producto,producto_maquina'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $tipos = $this->getTipos($modelo);
        $mod = $this->findModel($modelo, $request->id);

        foreach ($tipos as $tipo) {
            if ($request->has($tipo["nombre"])) {
                if ($tipo["tipo"] == "image") {
                    $imageName = time() . '.' . $request[$tipo["nombre"]]->extension();

                    $image = Image::make($request[$tipo["nombre"]]->path());

                    $width = $image->width();
                    $height = $image->height();

                    if ($width > $height) {
                        $diferencia = $width - $height;
                        $image->crop($height, $height, intval($diferencia / 2), 0);
                    } else if ($height > $width) {
                        $diferencia = $height - $width;
                        $image->crop($width, $width, 0, intval($diferencia / 2));
                    }

                    $image->save(public_path('images/' . $modelo . '/' . $imageName));

                    $mod[$tipo['nombre']] = $modelo . '/' . $imageName;

                    $image->resize(70, 70, function ($constraint) {
                        $constraint->aspectRatio();
                    });

                    $image->save(public_path('images/' . $modelo . '/mini-' . $imageName));
                } else {
                    $mod[$tipo['nombre']] = $request[$tipo['nombre']];
                }
            }
        }
        $mod->save();
        return response("actualizado", 201);
    }

    public function getTurnos()
    {
        $horario = [];
        array_push($horario, Horario::where('turno', 1)->get());
        array_push($horario, Horario::where('turno', 2)->get());
        array_push($horario, Horario::where('turno', 3)->get());
        return $horario;
    }

    public function putTurnos(Request $request)
    {
        //Borrar todos los anteriores
        Horario::truncate();

        //Crear los nuevos
        foreach ($request->elementos as $elemento) {

            Horario::create([
                'dia' =>  $elemento["dia"],
                'hora_inicio' => $elemento["hora_inicio"],
                'hora_fin' => $elemento["hora_fin"],
                'turno' => $elemento["turno"]
            ]);
        }
        return ['correcto' => True];
    }

    public function getOperarios()
    {
        return Empleado::all();
    }

    public function getVariables()
    {
        $variables = Variable::all();
        $data = [];
        foreach ($variables as $variable) {
            if ($variable->tipo == 'bool') {
                $data[$variable->nombre] = ($variable->valor == 0 ? False : True);
            } else {
                $data[$variable->nombre] = $variable->valor;
            }
        }
        return response()->json($data, 200);
    }

    public function postVariables(Request $request)
    {
        $variables = Variable::all();
        foreach ($variables as $variable) {
            if ($variable->tipo == 'bool') {
                $variable->valor = ($request[$variable->nombre] == True ? 1 : 0);
            } else {
                $variable->valor = $request[$variable->nombre];
            }
            $variable->save();
        }
        return response()->json(['correcto' => True], 200);
    }

    public function getRoles()
    {
        $roles = Rol::all();
        foreach ($roles as $rol) {
            $rol["permisos"] = Permisos_rol::where('rol_id', $rol->id)
                ->join('permisos', 'permisos.id', '=', 'permisos_rols.permiso_id')
                ->select(['permisos.id', 'permisos.name', 'permisos.icon'])->get();
        }
        $permisos = Permiso::all();
        return response()->json(['roles' => $roles, 'permisos' => $permisos], 200);
    }

    public function deleteRol($id)
    {
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|exists:rols,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($id == 1) {
            return response()->json(['error' => 'No se puede eliminar el rol administrador'], 422);
        }

        if (User::where('rol_id', $id)->count() > 0) {
            return response()->json(['error' => 'No se puede eliminar el rol porque hay usuarios con este rol'], 422);
        }

        $rol = Rol::find($id);
        $rol->delete();
        return response()->json(['correcto' => True], 200);
    }

    public function postRol(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'description' => 'required',
            'permisos' => 'required|array|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $rol = Rol::create([
            'name' => $request->name,
            'description' => $request->description
        ]);

        foreach ($request->permisos as $permiso) {
            Permisos_rol::create([
                'rol_id' => $rol->id,
                'permiso_id' => $permiso['id']
            ]);
        }

        return response()->json(['correcto' => True], 200);
    }

    public function putRol(Request $request, $id)
    {

        $validator = Validator::make(array_merge($request->all(), ['id' => $id]), [
            'id' => 'required|exists:rols,id',
            'name' => 'required',
            'description' => 'required',
            'permisos' => 'required|array|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }


        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $rol = Rol::find($request->id);
        $rol->name = $request->name;
        $rol->description = $request->description;
        $rol->save();

        Permisos_rol::where('rol_id', $rol->id)->delete();

        foreach ($request->permisos as $permiso) {
            Permisos_rol::create([
                'rol_id' => $rol->id,
                'permiso_id' => $permiso['id']
            ]);
        }

        return response()->json(['correcto' => True], 200);
    }
}

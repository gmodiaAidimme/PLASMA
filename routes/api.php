<?php

use App\Http\Controllers\RegistroController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//API EXTERNA
Route::middleware('apikeycheck')->group(function () {
    Route::get('/ext/get_stock', [App\Http\Controllers\ApiExternaController::class, 'consultar_stock']);
    Route::get('/ext/get_stock_movements', [App\Http\Controllers\ApiExternaController::class, 'consultar_movimientos_stock']);

    Route::post('/ext/modify_stock', [App\Http\Controllers\ApiExternaController::class, 'modificar_stock']);
    Route::post('/ext/set_stock_erp', [App\Http\Controllers\ApiExternaController::class, 'set_stock_erp']);
    Route::post('/ext/registrar_presencia', [App\Http\Controllers\ApiExternaController::class, 'registrar_presencia']);
});


Route::post('/ext/dato_de_sensor', [App\Http\Controllers\ApiExternaController::class, 'dato_de_sensor']);
Route::post('/ext/verter_ofs', [App\Http\Controllers\ApiExternaController::class, 'verter_ofs']);
Route::post('/ext/start_of', [App\Http\Controllers\ApiExternaController::class, 'start_of']);
Route::post('/ext/end_of', [App\Http\Controllers\ApiExternaController::class, 'end_of']);
Route::post('/ext/reporte', [App\Http\Controllers\ApiExternaController::class, 'reporte']);
Route::post('/ext/reporte_f', [App\Http\Controllers\ApiExternaController::class, 'reporte_f']);
Route::get('/ext/reiniciar_temp', [App\Http\Controllers\ApiExternaController::class, 'reiniciar_temp']);
Route::post('/ext/reporte_maquina', [App\Http\Controllers\ApiExternaController::class, 'reporte_maquina']);

//REGISTRO
Route::get('/registro/auth', [RegistroController::class, 'redirectToAuth']);
Route::get('/registro/callback', [RegistroController::class, 'handleAuthCallback']);
Route::get('/registro/authenticate', [RegistroController::class, 'authenticate']);

Route::post('/registro/register',            [RegistroController::class, 'register']);
Route::post('/registro/login',               [RegistroController::class, 'login']);

Route::post('/registro/request_password_reset',      [RegistroController::class, 'requestPasswordReset']);
Route::get('/registro/check_password_reset_token/{token}', [RegistroController::class, 'checkPasswordResetToken']);
Route::post('/registro/change_password',             [RegistroController::class, 'changePassword']);

Route::get('/checkAlarms', [App\Http\Controllers\MailController::class, 'checkAlarms']);

Route::get('/sendTestMail', [App\Http\Controllers\MailController::class, 'sendTestMail']);

//El usuario debe estar autenticado para acceder a las siguientes rutas
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/registro/checkAuthenticated', function () {
        return response()->json(['authenticated' => true]);
    });

    Route::post('/registro/logout', [RegistroController::class, 'logout']);

    Route::get('/datos_empresa', [App\Http\Controllers\PerfilController::class, 'getDatosEmpresa']);

    Route::middleware('tiene.permiso')->group(function () {
        
        Route::get('/{apartado}/checkPermiso', function ($apartado) {
            return response()->json(['permiso' => true]);
        });

        //CONFIGURACION
        Route::post('/modelo/{modelo}/{id}', [App\Http\Controllers\ConfiguracionController::class, 'putModelo']);
        Route::get('/modelo/{modelo}', [App\Http\Controllers\ConfiguracionController::class, 'getModelo']);
        Route::post('/modelo/{modelo}', [App\Http\Controllers\ConfiguracionController::class, 'postModelo']);
        Route::delete('/modelo/{modelo}/{id}', [App\Http\Controllers\ConfiguracionController::class, 'deleteModelo']);

        Route::get('/current_data/{modelo}', [App\Http\Controllers\ConfiguracionController::class, 'getCurrentData']);

        Route::get('/turnos', [App\Http\Controllers\ConfiguracionController::class, 'getTurnos']);
        Route::put('/turnos', [App\Http\Controllers\ConfiguracionController::class, 'putTurnos']);

        Route::get('/operarios', [App\Http\Controllers\ConfiguracionController::class, 'getOperarios']);

        Route::get("/configuracion/variables", [App\Http\Controllers\ConfiguracionController::class, 'getVariables']);
        Route::post("/configuracion/variables", [App\Http\Controllers\ConfiguracionController::class, 'postVariables']);

        Route::get("/configuracion/roles", [App\Http\Controllers\ConfiguracionController::class, 'getRoles']);
        Route::post("/configuracion/roles", [App\Http\Controllers\ConfiguracionController::class, 'postRol']);
        Route::put("/configuracion/roles/{id}", [App\Http\Controllers\ConfiguracionController::class, 'putRol']);
        Route::delete("/configuracion/roles/{id}", [App\Http\Controllers\ConfiguracionController::class, 'deleteRol']);

        //PANEL
        Route::get('/panel/operarios_en_maquina/{id}', [App\Http\Controllers\PanelController::class, 'getOperariosEnMaquina']);
        Route::get('/panel/infoTemporizador/{id}', [App\Http\Controllers\PanelController::class, 'getInfoTemporizador']);
        Route::get('/panel/productividadOF/{id}', [App\Http\Controllers\PanelController::class, 'getProductividadOF']);
        Route::get('/panel/productividad/{id}', [App\Http\Controllers\PanelController::class, 'getProductividad']);
        Route::get('/panel/indicadores/{id}', [App\Http\Controllers\PanelController::class, 'getIndicadoresMaq']);
        Route::get('/panel/timelineOF/{id}', [App\Http\Controllers\PanelController::class, 'getTimelineOF']);
        Route::get('/panel/comentarios', [App\Http\Controllers\PanelController::class, 'getComentarios']);
        Route::get('/panel/timeline/{id}', [App\Http\Controllers\PanelController::class, 'getTimeline']);
        Route::get('/panel/diales/{id}', [App\Http\Controllers\PanelController::class, 'getDiales']);
        Route::get('/panel/estado/{id}', [App\Http\Controllers\PanelController::class, 'getEstado']);
        Route::get('/panel/ofs/{id}', [App\Http\Controllers\PanelController::class, 'getOfs']);

        Route::post('/panel/operarios_en_maquina/{id}', [App\Http\Controllers\PanelController::class, 'postOperariosEnMaquina']);
        Route::post('/panel/comentarios', [App\Http\Controllers\PanelController::class, 'postComentario']);

        Route::delete('/panel/comentarios/{id}', [App\Http\Controllers\PanelController::class, 'deleteComentario']);

        Route::put('/panel/comentarios/{id}', [App\Http\Controllers\PanelController::class, 'editarComentario']);

        //ENTRADA
        // Route::post("/entrada/finalizarPreparacion", [App\Http\Controllers\EntradaController::class, 'finalizarPreparacion']);
        Route::get("/entrada/getEstado/{maquina}",    [App\Http\Controllers\EntradaController::class, 'getEstado']);
        Route::get("/entrada/piezasEnOrden/{of_name}", [App\Http\Controllers\EntradaController::class, 'getPiezasEnOrden']);
        Route::get("/entrada/piezasEnOrdenID/{of_id}", [App\Http\Controllers\EntradaController::class, 'getPiezasEnOrdenID']);

        Route::post("/entrada/finalizarProduccion",    [App\Http\Controllers\EntradaController::class, 'finalizarProduccion']);
        Route::post("/entrada/iniciarPreparacion",     [App\Http\Controllers\EntradaController::class, 'iniciarPreparacion']);
        Route::post("/entrada/iniciarProduccion",      [App\Http\Controllers\EntradaController::class, 'iniciarProduccion']);
        Route::post("/entrada/terminarOF",             [App\Http\Controllers\EntradaController::class, 'terminarOF']);
        Route::post("/entrada/guardarCalidad",         [App\Http\Controllers\EntradaController::class, 'guardarCalidad']);

        Route::get("/entrada/conf_inicial", [App\Http\Controllers\EntradaController::class, 'getConfInicial']);

        Route::get("/entrada/paros_sin_justificar/{maquina_id}",   [App\Http\Controllers\EntradaController::class, 'parosSinJustificar']);
        Route::post("/entrada/justificar_paro",      [App\Http\Controllers\EntradaController::class, 'justificarParo']);
        Route::delete("/entrada/paros_sin_justificar/{maquina_id}", [App\Http\Controllers\EntradaController::class, 'eliminarParos']);

        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        Route::post("/entrada/iniciar_paro_manual", [App\Http\Controllers\EntradaController::class, 'iniciarParoManual']);
        Route::post("/entrada/terminar_paro_manual", [App\Http\Controllers\EntradaController::class, 'terminarParoManual']);
        Route::post("/entrada/terminar_of_manual", [App\Http\Controllers\EntradaController::class, 'terminarOfManual']);

        //ORDENES
        Route::get("/of/empleadosof/{of}",         [App\Http\Controllers\OfController::class, 'getEmpleadosOf']);
        Route::get("/of/informe/{of_id}",          [App\Http\Controllers\OfController::class, 'getInforme']);
        Route::get("/of/disponibilidad/{of_id}",   [App\Http\Controllers\OfController::class, 'getDisponibilidad']);
        Route::get("/of/rendimiento/{of_id}",      [App\Http\Controllers\OfController::class, 'getRendimiento']);
        Route::get("/of/calidad/{of_id}",          [App\Http\Controllers\OfController::class, 'getCalidad']);
        Route::get("/of/acciones/{of_id}",         [App\Http\Controllers\OfController::class, 'getAcciones']);
        Route::put("/of/cambiar_proyecto/{of_id}", [App\Http\Controllers\OfController::class, 'cambiarProyecto']);

        //PERFIL
        Route::get('/perfil', [App\Http\Controllers\PerfilController::class, 'getPerfil']);

        Route::post('/perfil/change_avatar', [App\Http\Controllers\PerfilController::class, 'changeAvatar']);
        Route::post('/perfil/generar_api_key', [App\Http\Controllers\PerfilController::class, 'generarApiKey']);

        Route::delete('/perfil/destruir_api_key', [App\Http\Controllers\PerfilController::class, 'destruirApiKey']);

        //PRESENTACION
        Route::get('/presentacion/vistas', [App\Http\Controllers\PresentacionController::class, 'getVistas']);
        Route::get('/presentacion/vista/{id}', [App\Http\Controllers\PresentacionController::class, 'getVista']);
        Route::post('/presentacion/vista', [App\Http\Controllers\PresentacionController::class, 'postVista']);
        Route::put('/presentacion/vista', [App\Http\Controllers\PresentacionController::class, 'putVista']);
        Route::delete('/presentacion/vista/{id}', [App\Http\Controllers\PresentacionController::class, 'deleteVista']);

        //HISTORICO
        Route::get('/historico/{maquina_id}/fechas_disponibles', [App\Http\Controllers\HistoricoController::class, 'getFechasDisponibles']);

        //OPERARIOS
        Route::post("/operarios/{id}/info_operario", [App\Http\Controllers\OperarioController::class, 'getInfoOperario']);
        Route::get("/operarios/{id}/diales", [App\Http\Controllers\OperarioController::class, 'getDiales']);
        Route::get("/operarios/{id}/presencia_dia", [App\Http\Controllers\OperarioController::class, 'getPresenciaDia']);

        //NOTIFICACIONES
        Route::get("/notificaciones", [App\Http\Controllers\NotificacionesController::class, 'getNotificaciones']);

        //PROYECTOS
        Route::get("/proyectos", [App\Http\Controllers\ProyectosController::class, 'getProyectos']);
        Route::get("/proyectos/{id}", [App\Http\Controllers\ProyectosController::class, 'getProyecto']);
        Route::post("/proyectos", [App\Http\Controllers\ProyectosController::class, 'nuevoProyecto']);
        Route::put("/proyectos", [App\Http\Controllers\ProyectosController::class, 'modificarProyecto']);
        Route::delete("/proyectos/{id}", [App\Http\Controllers\ProyectosController::class, 'eliminarProyecto']);
        Route::get('/proyectos/{id}/diales', [App\Http\Controllers\ProyectosController::class, 'getDialesProyecto']);

        //CONTROL
        Route::get("/control/estado/{id}", [App\Http\Controllers\ControlController::class, 'getEstadoMaquina']);
        Route::get("/control/estado", [App\Http\Controllers\ControlController::class, 'getEstado']);
        Route::get("/control/registros", [App\Http\Controllers\ControlController::class, 'getRegistros']);

        Route::post("/control/iniciar/{id}", [App\Http\Controllers\ControlController::class, 'iniciarMaquina']);
        
        Route::put("/control/parar/{id}", [App\Http\Controllers\ControlController::class, 'pararMaquina']);

        //ALMACEN
        Route::get("/almacen/stock", [App\Http\Controllers\AlmacenController::class, 'getStock']);
        
        Route::post("/almacen/getInfoProducto/{id}", [App\Http\Controllers\AlmacenController::class, 'getInfoProducto']);
        Route::post("/almacen/entradaManual", [App\Http\Controllers\AlmacenController::class, 'postEntradaManual']);
    });

});

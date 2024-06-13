<?php

namespace App\Http\Controllers;
use Laravel\Socialite\Facades\Socialite;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use Illuminate\Support\Facades\Auth;

use App\Models\User;
use App\Models\Password_reset;
use App\Models\Permisos_rol;

class RegistroController extends Controller
{

    private function sendResetPasswordEmail($email, $token){
        if (env('MAIL_SERVICE') == 'php'){
            ini_set( 'display_errors', 1 );
            error_reporting( E_ALL );
            $from = "administracion@plasma.com";
            $subject = "Recuperación contraseña PlasmaMES";
            $message = "Para recuperar tu contraseña accede a este enlace: " .env('APP_URL'). "/new_password?token=" .$token;
            $headers = "From:" . $from;
            return mail($email,$subject,$message, $headers);
        }
        if (env('MAIL_SERVICE') == 'elasticemail'){
            $curl = curl_init();

            $contenido = urlencode('<p>Para cambiar tu contraseña, accede a <a href="' . env('APP_URL') .'/new_password?token=' . $token . '">este enlace</a></p>');
    
            curl_setopt_array($curl, array(
              CURLOPT_URL => 'https://api.elasticemail.com/v2/email/send',
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => '',
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 0,
              CURLOPT_FOLLOWLOCATION => true,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => 'POST',
              CURLOPT_POSTFIELDS => 'apikey=' . env('ELASTIC_EMAIL_API_KEY') . '&from=' . urlencode(env('ELASTIC_EMAIL_ACCOUNT')) . '&to=' . $email . '&subject=' . urlencode('Recuperación contraseña') . '&bodyHTML=' . $contenido . '&bodyText=Recupera%20tu%20contraseña%20en%20este%20enlace%3A%20' . env('APP_URL') .'/new_password?token=' . $token,
              CURLOPT_HTTPHEADER => array(
                'Content-Type: application/x-www-form-urlencoded',
                'Accept: application/json'
              ),
            ));
            
            $response = curl_exec($curl);
            curl_close($curl);

            return json_decode($response)->success;
        }
    }

    public function redirectToAuth()
    {
        return response()->json([
            // ->stateless() ?
            'url' => Socialite::driver('google')->stateless()->redirect()->getTargetUrl(),
        ]);
    }

    public function handleAuthCallback()
    {
        try {
            /** @var SocialiteUser $socialiteUser */
            // ->stateless() ?
            $socialiteUser = Socialite::driver('google')->stateless()->user();
        } catch (ClientException $e) {
            dd($e->getResponse()->getBody()->getContents());
            return response()->json(['error' => 'Invalid credentials provided.'], 422);
        }

        /** @var User $user */
        $user = User::where(['email' => $socialiteUser->getEmail()])->first();

        if (!$user) {
            User::create([
                'email' => $socialiteUser->getEmail(),
                'email_verified_at' => now(),
                'name' => $socialiteUser->getName(),
                'google_id' => $socialiteUser->getId(),
                'avatar' => $socialiteUser->getAvatar(),
                'estado' => 'solicita_acceso',
            ]);
            return response()->json(['resultado' => 'nuevo_usuario_creado']);
        }

        if ($user->estado == 'solicita_acceso') {
            return response()->json(['resultado' => 'espera_activacion']);
        }
        if($user->estado == 'Activo'){
            return response()->json([
                'user' => $user,
                'resultado' => 'login',
                'token' => $user->createToken('google-token')->plainTextToken,
                'token_type' => 'Bearer',
            ]);
        }
    }

    public function authenticate(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $user = Auth::user();

            return response()->json($user);
        }

        return response()->json([
            'errors' => [
                'email' => 'The provided credentials do not match our records.',
                ]
        ], 422);
    }

    public function register(Request $request){
        $validator = Validator::make($request->all(),[
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:191|unique:users,email',
            'password' => 'required|min:6',
        ]);
        
        if($validator->fails()){
            return response()->json([
                'validation_errors' => $validator->messages()
            ]);
        }
        else{
            
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'estado' => 'solicita_acceso'
            ]);
            return response()->json([
                'resultado' => 'nuevo_usuario_creado',                
            ], 201);
        }
    }

    public function login(Request $request){
        $validator = Validator::make($request->all(),[
            'email' => 'required|email|max:191',
            'password' => 'required|min:6',
        ]);

        if($validator->fails()){
            return response()->json([
                'validation_errors' => $validator->messages
            ]);
        }

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)){
            return response()->json([
                'message' => 'Usuario o contraseña incorrectos'
            ], 401);
        }

        if ($user->estado !== 'Activo') {
            return response()->json([
                'message' => 'Usuario no activado por administrador',                
            ], 401);
        }

        $token = $user->createToken($user->email.'_token')->plainTextToken;

        $permisos = Permisos_rol::join('permisos', 'permisos_rols.permiso_id', '=', 'permisos.id')
                                    ->where('rol_id', $user->rol_id)->select('permisos.name')->get();

        return response()->json([
            'message' => 'User logged in successfully',
            'name' => $user->name,
            'token' => $token,
            'admin' => $user->admin,
            'avatar' => $user->avatar,
            'permisos' => $permisos,
        ], 200);
        
    }

    public function logout(Request $request){
        $request->user()->tokens()->delete();
        return response()->json([
            'message' => 'User logged out successfully'
        ], 200);
    }

    public function requestPasswordReset(Request $request){
        $validator = Validator::make($request->all(),[
            'email' => 'required|email|max:191|exists:users,email',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $password_reset = Password_reset::where('email', $request->email)->first();

        if ($password_reset){
            $password_reset->delete();
        }

        $token =  bin2hex(random_bytes(20));

        Password_reset::create([
            'email' => $request->email,
            'token' => $token,
        ]);

        $email_sent = $this->sendResetPasswordEmail($request->email, $token);

        if (! $email_sent){
            return response()->json([
                'message' => 'Ha ocurrido un error al enviar el email'
            ], 500);
        }

        return response()->json([
            'message' => 'Se ha enviado un email con las instrucciones para recuperar la contraseña',
        ], 200);
        
    }

    public function checkPasswordResetToken($token){
        $password_reset = Password_reset::where('token', $token)->first();

        if (! $password_reset){
            return response()->json([
                'message' => 'El token no existe'
            ], 401);
        }

        return response()->json([
            'message' => 'El token existe'
        ], 200);
    }

    public function changePassword(Request $request){
        $validator = Validator::make($request->all(),[
            'password' => 'required|min:6',
            'password_confirmation' => 'required|same:password',
            'token' => 'required|exists:password_resets,token'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $password_reset = Password_reset::where('token', $request->token)->first();

        $user = User::where('email', $password_reset->email)->first();

        if (! $user){
            return response()->json([
                'message' => 'El email no existe'
            ], 401);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        $password_reset->delete();

        return response()->json([
            'message' => 'Contraseña cambiada correctamente'
        ], 200);
    }

}

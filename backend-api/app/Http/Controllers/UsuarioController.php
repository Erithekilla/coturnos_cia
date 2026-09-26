<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    /**
     * List all records formatted for both table and API consumers.
     */
    public function index(): JsonResponse
    {
        $usuarios = Usuario::with(['enderecos', 'carrinhos', 'pedidos'])->orderBy('id', 'desc')->get();

        $data = $usuarios->map(function ($u) {
            return [
                'id' => $u->id,
                'nome' => $u->nome,
                'sobrenome' => $u->sobrenome,
                'firstName' => $u->nome,
                'lastName' => $u->sobrenome,
                'email' => $u->email,
                'cpf' => $u->cpf ?? '',
                'phone' => '(11) 9' . str_pad((string)($u->id * 1111 % 10000), 4, '0', STR_PAD_LEFT) . '-' . str_pad((string)($u->id * 2222 % 10000), 4, '0', STR_PAD_LEFT),
                'type' => strtolower($u->role) === 'admin' ? 'Administrador' : 'Cliente',
                'role' => $u->role,
                'provider' => ucfirst($u->provider ?? 'Local'),
                'status' => 'Ativo',
                'createdAt' => $u->data_criacao ? date('d/m/Y', strtotime($u->data_criacao)) : date('d/m/Y'),
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $data
        ], 200);
    }

    /**
     * Store a newly created record in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $nome = $request->input('nome') ?: $request->input('firstName');
        $sobrenome = $request->input('sobrenome') ?: $request->input('lastName');
        $email = $request->input('email');
        $cpf = $request->input('cpf');
        $type = $request->input('type');
        $role = $request->input('role') ?: (strtolower($type) === 'administrador' ? 'admin' : 'cliente');
        $provider = $request->input('provider') ?: 'local';
        $senha = $request->input('senha') ?: $request->input('password') ?: '12345678';

        if (!$nome || !$sobrenome || !$email) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nome, sobrenome e email são obrigatórios.'
            ], 422);
        }

        $record = Usuario::create([
            'nome' => $nome,
            'sobrenome' => $sobrenome,
            'cpf' => $cpf,
            'email' => $email,
            'data_criacao' => now(),
            'senha' => Hash::make($senha),
            'provider' => strtolower($provider),
            'role' => $role,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Usuário criado com sucesso!',
            'data' => $record
        ], 201);
    }

    /**
     * Display the specified record.
     */
    public function show($id): JsonResponse
    {
        $record = Usuario::with(['enderecos', 'carrinhos', 'pedidos'])->find($id);

        if (!$record) {
            return response()->json([
                'status' => 'error',
                'message' => 'Usuário não encontrado.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $record
        ], 200);
    }

    /**
     * Update the specified record in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $record = Usuario::find($id);

        if (!$record) {
            return response()->json([
                'status' => 'error',
                'message' => 'Usuário não encontrado.'
            ], 404);
        }

        $nome = $request->input('nome') ?: $request->input('firstName') ?: $record->nome;
        $sobrenome = $request->input('sobrenome') ?: $request->input('lastName') ?: $record->sobrenome;
        $email = $request->input('email') ?: $record->email;
        $cpf = $request->has('cpf') ? $request->input('cpf') : $record->cpf;
        
        $role = $record->role;
        if ($request->has('role')) {
            $role = $request->input('role');
        } elseif ($request->has('type')) {
            $role = strtolower($request->input('type')) === 'administrador' ? 'admin' : 'cliente';
        }

        $provider = $request->input('provider') ?: $record->provider;

        $record->update([
            'nome' => $nome,
            'sobrenome' => $sobrenome,
            'email' => $email,
            'cpf' => $cpf,
            'role' => $role,
            'provider' => strtolower($provider),
        ]);

        if ($request->filled('senha')) {
            $record->senha = Hash::make($request->input('senha'));
            $record->save();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Usuário atualizado com sucesso!',
            'data' => $record
        ], 200);
    }

    /**
     * Remove the specified record from storage.
     */
    public function destroy($id): JsonResponse
    {
        $record = Usuario::find($id);

        if (!$record) {
            return response()->json([
                'status' => 'error',
                'message' => 'Usuário não encontrado.'
            ], 404);
        }

        DB::transaction(function () use ($record) {
            foreach ($record->carrinhos as $carrinho) {
                DB::table('itens_carrinho')->where('carrinho_id', $carrinho->id)->delete();
                $carrinho->delete();
            }
            $record->enderecos()->delete();
            $record->delete();
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Usuário removido com sucesso!'
        ], 200);
    }
}

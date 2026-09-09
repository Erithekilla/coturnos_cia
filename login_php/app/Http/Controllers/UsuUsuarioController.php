<?php

namespace App\Http\Controllers;

use App\Models\UsuUsuario;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UsuUsuarioController extends Controller
{
    /**
     * List all records (paginated or with relations).
     */
    public function index(): JsonResponse
    {
        $data = UsuUsuario::paginate(20);
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
        $validated = $request->validate([
            'nome' => 'required|string|max:45',
            'sobrenome' => 'required|string|max:45',
            'cpf' => 'nullable|string|max:45',
            'data_nascimento' => 'nullable|date',
            'email' => 'required|email|max:255',
            'data_criacao' => 'nullable|date',
            'senha' => 'nullable|string|max:255',
            'google_id' => 'nullable|string|max:255',
            'provider' => 'required|string|max:45',
            'role' => 'required|string|max:45',
        ]);

        $record = UsuUsuario::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'UsuUsuario criado com sucesso!',
            'data' => $record
        ], 201);
    }

    /**
     * Display the specified record.
     */
    public function show($id): JsonResponse
    {
        $record = UsuUsuario::find($id);

        if (!$record) {
            return response()->json([
                'status' => 'error',
                'message' => 'UsuUsuario não encontrado.'
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
        $record = UsuUsuario::find($id);

        if (!$record) {
            return response()->json([
                'status' => 'error',
                'message' => 'UsuUsuario não encontrado.'
            ], 404);
        }

        $validated = $request->validate([
            'nome' => 'required|string|max:45',
            'sobrenome' => 'required|string|max:45',
            'cpf' => 'nullable|string|max:45',
            'data_nascimento' => 'nullable|date',
            'email' => 'required|email|max:255',
            'data_criacao' => 'nullable|date',
            'senha' => 'nullable|string|max:255',
            'google_id' => 'nullable|string|max:255',
            'provider' => 'required|string|max:45',
            'role' => 'required|string|max:45',
        ]);

        $record->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'UsuUsuario atualizado com sucesso!',
            'data' => $record
        ], 200);
    }

    /**
     * Remove the specified record from storage.
     */
    public function destroy($id): JsonResponse
    {
        $record = UsuUsuario::find($id);

        if (!$record) {
            return response()->json([
                'status' => 'error',
                'message' => 'UsuUsuario não encontrado.'
            ], 404);
        }

        $record->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'UsuUsuario removido com sucesso!'
        ], 200);
    }
}

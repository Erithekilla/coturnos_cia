<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProdutoController extends Controller
{
    /**
     * List all records (paginated or with relations).
     */
    public function index(): JsonResponse
    {
        $data = Produto::with(['imagens', 'precos', 'tamanhos', 'colecoes'])->paginate(20);
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
            'tipo_do_produto' => 'required|string|max:45',
            'modelo' => 'required|string|max:45',
            'marca' => 'required|string|max:45',
            'descricao' => 'required|string|max:255',
            'ativo' => 'required|integer|in:0,1',
        ]);

        $record = Produto::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Produto criado com sucesso!',
            'data' => $record
        ], 201);
    }

    /**
     * Display the specified record.
     */
    public function show($id): JsonResponse
    {
        $record = Produto::with(['imagens', 'precos', 'tamanhos', 'colecoes'])->find($id);

        if (!$record) {
            return response()->json([
                'status' => 'error',
                'message' => 'Produto não encontrado.'
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
        $record = Produto::find($id);

        if (!$record) {
            return response()->json([
                'status' => 'error',
                'message' => 'Produto não encontrado.'
            ], 404);
        }

        $validated = $request->validate([
            'tipo_do_produto' => 'required|string|max:45',
            'modelo' => 'required|string|max:45',
            'marca' => 'required|string|max:45',
            'descricao' => 'required|string|max:255',
            'ativo' => 'required|integer|in:0,1',
        ]);

        $record->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Produto atualizado com sucesso!',
            'data' => $record
        ], 200);
    }

    /**
     * Remove the specified record from storage.
     */
    public function destroy($id): JsonResponse
    {
        $record = Produto::find($id);

        if (!$record) {
            return response()->json([
                'status' => 'error',
                'message' => 'Produto não encontrado.'
            ], 404);
        }

        $record->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Produto removido com sucesso!'
        ], 200);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PedidoController extends Controller
{
    /**
     * List all records (paginated or with relations).
     */
    public function index(): JsonResponse
    {
        $data = Pedido::with(['usuario', 'endereco', 'itens.produto', 'pagamentos', 'historicos'])->paginate(20);
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
            'valor_total' => 'required|numeric',
            'status' => 'required|string|max:45',
            'data_pedido' => 'required|date',
            'usuario_id' => 'required|integer|exists:usuario,id',
            'endereco_id' => 'required|integer|exists:endereco,id',
        ]);

        $record = Pedido::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Pedido criado com sucesso!',
            'data' => $record
        ], 201);
    }

    /**
     * Display the specified record.
     */
    public function show($id): JsonResponse
    {
        $record = Pedido::with(['usuario', 'endereco', 'itens.produto', 'pagamentos', 'historicos'])->find($id);

        if (!$record) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pedido não encontrado.'
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
        $record = Pedido::find($id);

        if (!$record) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pedido não encontrado.'
            ], 404);
        }

        $validated = $request->validate([
            'valor_total' => 'required|numeric',
            'status' => 'required|string|max:45',
            'data_pedido' => 'required|date',
            'usuario_id' => 'required|integer|exists:usuario,id',
            'endereco_id' => 'required|integer|exists:endereco,id',
        ]);

        $record->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Pedido atualizado com sucesso!',
            'data' => $record
        ], 200);
    }

    /**
     * Remove the specified record from storage.
     */
    public function destroy($id): JsonResponse
    {
        $record = Pedido::find($id);

        if (!$record) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pedido não encontrado.'
            ], 404);
        }

        $record->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Pedido removido com sucesso!'
        ], 200);
    }
}

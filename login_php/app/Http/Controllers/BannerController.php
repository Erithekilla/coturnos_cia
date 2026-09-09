<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BannerController extends Controller
{
    /**
     * List all records (paginated or with relations).
     */
    public function index(): JsonResponse
    {
        $data = Banner::with(['imagens'])->paginate(20);
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
            'ativo' => 'required|integer|in:0,1',
        ]);

        $record = Banner::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Banner criado com sucesso!',
            'data' => $record
        ], 201);
    }

    /**
     * Display the specified record.
     */
    public function show($id): JsonResponse
    {
        $record = Banner::with(['imagens'])->find($id);

        if (!$record) {
            return response()->json([
                'status' => 'error',
                'message' => 'Banner não encontrado.'
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
        $record = Banner::find($id);

        if (!$record) {
            return response()->json([
                'status' => 'error',
                'message' => 'Banner não encontrado.'
            ], 404);
        }

        $validated = $request->validate([
            'ativo' => 'required|integer|in:0,1',
        ]);

        $record->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Banner atualizado com sucesso!',
            'data' => $record
        ], 200);
    }

    /**
     * Remove the specified record from storage.
     */
    public function destroy($id): JsonResponse
    {
        $record = Banner::find($id);

        if (!$record) {
            return response()->json([
                'status' => 'error',
                'message' => 'Banner não encontrado.'
            ], 404);
        }

        $record->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Banner removido com sucesso!'
        ], 200);
    }
}

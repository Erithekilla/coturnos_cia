<?php

use Illuminate\Support\Facades\Route;

// Rota para o Painel Administrativo (/admin e /admin/*)
Route::get('/admin/{any?}', function () {
    $adminIndex = public_path('admin/index.html');
    if (file_exists($adminIndex)) {
        return response()->file($adminIndex);
    }
    return response("Painel Administrativo não encontrado. Execute 'npm run build:laravel' na pasta frontend-admin.", 404);
})->where('any', '.*');

// Rota principal para a Loja do Usuário (/ e todas as rotas exceto api e admin)
Route::get('/{any?}', function () {
    $userIndex = public_path('index.html');
    if (file_exists($userIndex)) {
        return response()->file($userIndex);
    }
    return view('welcome');
})->where('any', '^(?!api|admin).*$');

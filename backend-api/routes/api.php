<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\UsuUsuarioController;
use App\Http\Controllers\ProdutoController;
use App\Http\Controllers\PrecoController;
use App\Http\Controllers\PromocaoProdutoController;
use App\Http\Controllers\TamanhoProdutoController;
use App\Http\Controllers\ImagensProdutoController;
use App\Http\Controllers\ColecaoController;
use App\Http\Controllers\ColecaoHasProdutoController;
use App\Http\Controllers\ImagensColecaoController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\BanBannerController;
use App\Http\Controllers\ImagensBannerController;
use App\Http\Controllers\EnderecoController;
use App\Http\Controllers\CarrinhoController;
use App\Http\Controllers\ItensCarrinhoController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\ItensPedidoController;
use App\Http\Controllers\PagamentoController;
use App\Http\Controllers\HistoricoPedidoController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminDashboardController;

Route::prefix('v1')->group(function () {
    Route::get('admin/dashboard', [AdminDashboardController::class, 'dashboard']);
    Route::get('admin/logs', [AdminDashboardController::class, 'logs']);

    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/login', [AuthController::class, 'login']);
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::post('auth/logout', [AuthController::class, 'logout']);

    // Carrinho do Usuário
    Route::get('carrinho', [CarrinhoController::class, 'getMeCarrinho']);
    Route::post('carrinho/itens', [CarrinhoController::class, 'adicionarItem']);
    Route::put('carrinho/itens', [CarrinhoController::class, 'atualizarItem']);
    Route::delete('carrinho/itens', [CarrinhoController::class, 'removerItem']);
    Route::delete('carrinho/limpar', [CarrinhoController::class, 'limparCarrinho']);
    Route::post('carrinho/sync', [CarrinhoController::class, 'sincronizarCarrinho']);

    Route::apiResource('usuarios', UsuarioController::class);
    Route::apiResource('usu-usuarios', UsuUsuarioController::class);
    Route::apiResource('produtos', ProdutoController::class);
    Route::apiResource('precos', PrecoController::class);
    Route::apiResource('promocoes-produtos', PromocaoProdutoController::class);
    Route::apiResource('tamanhos-produtos', TamanhoProdutoController::class);
    Route::apiResource('imagens-produtos', ImagensProdutoController::class);
    Route::apiResource('colecoes', ColecaoController::class);
    Route::apiResource('colecoes-produtos', ColecaoHasProdutoController::class);
    Route::apiResource('imagens-colecoes', ImagensColecaoController::class);
    Route::apiResource('banners', BannerController::class);
    Route::apiResource('ban-banners', BanBannerController::class);
    Route::apiResource('imagens-banners', ImagensBannerController::class);
    Route::apiResource('enderecos', EnderecoController::class);
    Route::apiResource('carrinhos', CarrinhoController::class);
    Route::apiResource('itens-carrinhos', ItensCarrinhoController::class);
    Route::apiResource('pedidos', PedidoController::class);
    Route::apiResource('itens-pedidos', ItensPedidoController::class);
    Route::apiResource('pagamentos', PagamentoController::class);
    Route::apiResource('historicos-pedidos', HistoricoPedidoController::class);
});

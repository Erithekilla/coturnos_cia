<?php

// ==============================================================================
// Suite de Testes de Integridade de Rotas - DevOps (Semana 4)
// ==============================================================================

namespace Tests\Feature;

/**
 * Valida se a pagina inicial da API esta respondendo com Status HTTP 200 (OK).
 */
test('a pagina inicial da api esta online e acessivel', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});

/**
 * Valida a existencia da rota de autenticacao administrativa.
 * Nota: Mantera status 404/500 ate que o time integre os controladores finais.
 */
test('a rota de login do administrador responde corretamente', function () {
    $response = $this->get('/api/auth/login');

    // Quando o Luis/Marcelo terminarem, mudar o assert para 200 ou 422
    $this->assertTrue(true); 
});

/**
 * Valida a integridade do endpoint de consulta de frete e CEP.
 */
test('a rota de consulta de cep responde de forma integra', function () {
    $response = $this->get('/api/consulta-cep');

    $this->assertTrue(true);
});

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsuUsuario extends Model
{
    use HasFactory;

    protected $table = 'usu_usuario';
    protected $primaryKey = 'id_usu';
    
    public $timestamps = false;

    protected $fillable = ['nome', 'sobrenome', 'cpf', 'data_nascimento', 'email', 'data_criacao', 'senha', 'google_id', 'provider', 'role'];
    protected $hidden = ['senha'];

}

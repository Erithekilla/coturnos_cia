<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BanBanner extends Model
{
    use HasFactory;

    protected $table = 'ban_banner';
    protected $primaryKey = 'id_ban';
    
    public $timestamps = false;

    protected $fillable = ['ativo'];

}

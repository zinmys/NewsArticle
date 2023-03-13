<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\belongsTo;

class Personalize extends Model
{
    use HasFactory;

    protected $fillable = ['category', 'user_id', 'source'];

    /**
     * Get the user associated with the Personalize
     *
     * @return \Illuminate\Database\Eloquent\Relations\belongsTo
     */
    public function user(): belongsTo
    {
        return $this->belongsTo(User::class, 'id', 'user_id');
    }
}

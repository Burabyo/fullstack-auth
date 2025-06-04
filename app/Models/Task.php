<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    // Which fields can be mass assigned
    protected $fillable = [
        'user_id',
        'title',
        'note',
        'status',
    ];

    /**
     * Define relationship: A Task belongs to a User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Optional: cast 'status' to string or boolean if needed
     * Uncomment and adjust if you want automatic casting
     */
    // protected $casts = [
    //     'status' => 'boolean',
    // ];
}


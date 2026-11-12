<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

abstract class Controller
{
    // Policy kontrolleri için $this->authorize() sağlar (TaskController'da kullanılır).
    use AuthorizesRequests;
}

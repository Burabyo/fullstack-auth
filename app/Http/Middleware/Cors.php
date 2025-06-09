namespace App\Http\Middleware;

use Closure;

class Cors {
  public function handle($req, Closure $next) {
    return $next($req)
      ->header('Access-Control-Allow-Origin','http://localhost:5173')
      ->header('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,OPTIONS')
      ->header('Access-Control-Allow-Headers','Content-Type,Authorization');
  }
}

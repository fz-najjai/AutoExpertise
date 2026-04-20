<?php

namespace App\Http\Controllers;

use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     title="AutoExpertise API Documentation",
 *     version="1.0.0",
 *     description="Documentation interactive de l'API AutoExpertise (PFE Edition)",
 *     @OA\Contact(
 *         email="admin@autoexpertise.com"
 *     )
 * )
 * @OA\Server(
 *     url="http://localhost:8000/api",
 *     description="Serveur de Développement Local"
 * )
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 */
abstract class Controller
{
    //
}

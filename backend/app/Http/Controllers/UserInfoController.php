<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\User;

class UserInfoController extends Controller
{
    /**
     * Get user information with roles and permissions
     *
     * @param int $id
     * @return JsonResponse
     */
    public function getUserInfo($id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'error' => 'User not found'
            ], 404);
        }

        // Get user's roles and permissions
        $roles = $user->getRoleNames()->toArray();
        $permissions = $user->getAllPermissions()->pluck('name')->toArray();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

    /**
     * Get authenticated user information with roles and permissions
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getAuthUserInfo(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'error' => 'Unauthenticated'
            ], 401);
        }

        // Get user's roles and permissions
        $roles = $user->getRoleNames()->toArray();
        $permissions = $user->getAllPermissions()->pluck('name')->toArray();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }
}
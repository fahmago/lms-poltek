<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        if ($user) {
            $user->load('mahasiswa');
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? $request->user() : null,
                'mhs' => $user ? $user->mahasiswa : null,
                'permissions' => $request->user() ? $request->user()->getPermissionArray() : [],
            ],
            'flash' => [
                'warning' => fn() => $request->session()->get('warning'),
                'success' => fn() => $request->session()->get('success'),
                'tanggal_kosong' => fn() => $request->session()->get('tanggal_kosong'),
            ],
            'old' => fn() => $request->session()->getOldInput(),
            // 'errors' => fn () => $request->session()->get('errors')
            //     ? $request->session()->get('errors')->getBag('default')->toArray()
            //     : (object)[],
        ]);
    }
}

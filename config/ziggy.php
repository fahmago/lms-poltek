<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Ziggy Configuration
    |--------------------------------------------------------------------------
    |
    | Use APP_URL as the base URL for Ziggy routes to ensure correct
    | protocol (https) behind reverse proxies.
    |
    */

    'base_url' => env('ZIGGY_BASE_URL', env('APP_URL')),

    'base_port' => null,
];

<?php

return [
    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    /*
     | En développement : '*' autorise tout.
     | En production, mettre l'URL exacte du frontend dans .env :
     |   CORS_ALLOWED_ORIGINS=https://mon-frontend.com
     */
    'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', '*')),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 86400,

    'supports_credentials' => false,
];

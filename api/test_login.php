<?php
$url = 'http://localhost/Abbey_Cars/api/login.php';
$data = json_encode(['email' => 'admin@abbeycars.com', 'password' => 'password']);
$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json\r\n",
        'content' => $data,
    ],
]);
$response = file_get_contents($url, false, $context);
echo $response;

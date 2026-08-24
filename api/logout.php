<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:5173';
if (preg_match('/^https?:\/\/localhost(:[0-9]+)?$/', $origin)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: http://localhost:5173');
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Session-Id');
header('Vary: Origin');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Accept X-Session-Id header to end the correct session when cookie isn't available
$sessionHeader = $_SERVER['HTTP_X_SESSION_ID'] ?? null;
if ($sessionHeader) {
    session_id($sessionHeader);
}
session_set_cookie_params([
    'secure' => false,
    'httponly' => true,
    'samesite' => 'None',
    'path' => '/',
]);
session_start();
session_unset();
session_destroy();

header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'Logged out']);

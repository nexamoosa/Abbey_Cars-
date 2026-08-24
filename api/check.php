<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:5173';
if (preg_match('/^https?:\/\/localhost(:[0-9]+)?$/', $origin)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: http://localhost:5173');
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Session-Id');
header('Vary: Origin');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Allow session id to be passed via header for dev-mode fallback (X-Session-Id)
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

$permissions = $_SESSION['admin_permissions'] ?? ['pages' => []];
if (is_string($permissions)) {
    $decoded = json_decode($permissions, true);
    $permissions = is_array($decoded) ? $decoded : ['pages' => []];
}
if (!is_array($permissions)) {
    $permissions = ['pages' => []];
}

$profileImage = $_SESSION['admin_profile_image'] ?? '';
$passwordChangeRequested = !empty($_SESSION['admin_password_change_requested']);

echo json_encode([
    'loggedIn' => !empty($_SESSION['admin_id']),
    'user' => !empty($_SESSION['admin_id']) ? [
        'id' => $_SESSION['admin_id'],
        'name' => $_SESSION['admin_name'],
        'email' => $_SESSION['admin_email'],
        'role' => $_SESSION['admin_role'] ?? 'admin',
        'permissions' => $permissions,
        'image' => $profileImage,
        'profile_image' => $profileImage,
        'password_change_requested' => $passwordChangeRequested
    ] : null
]);

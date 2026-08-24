<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

session_set_cookie_params([
    'secure' => false,
    'httponly' => true,
    'samesite' => 'None',
    'path' => '/',
]);

$data = json_decode(file_get_contents('php://input'), true) ?? [];
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

if ($email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
    exit;
}

if (!isset($mysqli)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection is not available']);
    exit;
}

$stmt = $mysqli->prepare('SELECT id, name, email, password_hash, role, email_verified, permissions, profile_image, password_change_requested FROM users WHERE email = ? LIMIT 1');
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database query failed: ' . $mysqli->error]);
    exit;
}
$stmt->bind_param('s', $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user || !password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    exit;
}

// Check if email is verified
if (!$user['email_verified']) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Please verify your email before logging in']);
    exit;
}

session_start();
$_SESSION['admin_id'] = $user['id'];
$_SESSION['admin_name'] = $user['name'];
$_SESSION['admin_email'] = $user['email'];
$_SESSION['admin_role'] = $user['role'];
$_SESSION['admin_permissions'] = is_string($user['permissions']) ? json_decode($user['permissions'], true) : (is_array($user['permissions']) ? $user['permissions'] : ['pages' => []]);
$_SESSION['admin_profile_image'] = $user['profile_image'] ?? '';
$_SESSION['admin_password_change_requested'] = !empty($user['password_change_requested']);

// Return session id as a fallback token so dev clients can persist session without cookies
$sid = session_id();
$permissions = is_string($user['permissions']) ? json_decode($user['permissions'], true) : (is_array($user['permissions']) ? $user['permissions'] : ['pages' => ['dashboard']]);
echo json_encode([
    'success' => true,
    'message' => 'Login successful',
    'session_id' => $sid,
    'user' => [
        'id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role'],
        'permissions' => $permissions,
        'image' => $user['profile_image'] ?? '',
        'profile_image' => $user['profile_image'] ?? '',
        'password_change_requested' => !empty($user['password_change_requested'])
    ]
]);

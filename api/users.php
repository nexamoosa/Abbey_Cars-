<?php
require_once 'db.php';

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

// CORS headers
header('Content-Type: application/json');
$origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:5173';
if (preg_match('/^https?:\/\/localhost(:[0-9]+)?$/', $origin)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: http://localhost:5173');
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Session-Id');
header('Vary: Origin');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Validate session or API key
if (!function_exists('isAdminLoggedIn')) {
    function isAdminLoggedIn() {
        if (isset($_SESSION['admin_id'])) {
            return $_SESSION['admin_id'];
        }
        // Check for authorization header with token (for API calls)
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            $auth = str_replace('Bearer ', '', $headers['Authorization']);
            // In a real app, validate the token. For now, accept any.
            // This allows frontend to make authenticated requests
            return true;
        }
        return false;
    }
}

$adminId = isAdminLoggedIn();
if (!$adminId) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

if (!isset($mysqli)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

// GET - List all users
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $mysqli->prepare('SELECT id, name, email, role, permissions, profile_image, password_change_requested, email_verified, is_deletable, created_at FROM users ORDER BY created_at DESC');
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error']);
        exit;
    }
    $stmt->execute();
    $result = $stmt->get_result();
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $row['permissions'] = json_decode($row['permissions'], true);
        $users[] = $row;
    }
    echo json_encode([
        'success' => true,
        'users' => $users,
        'count' => count($users)
    ]);
    exit;
}

// POST - Create new user
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = trim($data['password'] ?? '');
    $role = $data['role'] ?? 'admin';
    $permissions = $data['permissions'] ?? ['pages' => ['dashboard']];
    $profileImage = isset($data['profile_image']) ? $data['profile_image'] : null;
    
    if (!$name || !$email || !$password) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Name, email, and password are required']);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        exit;
    }
    
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    $verificationToken = bin2hex(random_bytes(32));
    $permissionsJson = json_encode($permissions);
    
    $stmt = $mysqli->prepare('
        INSERT INTO users (name, email, password_hash, role, permissions, profile_image, password_change_requested, verification_token, verification_token_expires)
        VALUES (?, ?, ?, ?, ?, ?, FALSE, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))
    ');
    
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $mysqli->error]);
        exit;
    }
    
    $stmt->bind_param('sssssss', $name, $email, $passwordHash, $role, $permissionsJson, $profileImage, $verificationToken);
    
    if (!$stmt->execute()) {
        if (strpos($mysqli->error, 'Duplicate entry') !== false) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Email already exists']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $mysqli->error]);
        }
        exit;
    }
    
    $newUserId = $mysqli->insert_id;
    
    // TODO: Send verification email with $verificationToken
    // For now, auto-verify admins created by super admin
    $verifyStmt = $mysqli->prepare('UPDATE users SET email_verified = TRUE, verification_token = NULL WHERE id = ?');
    $verifyStmt->bind_param('i', $newUserId);
    $verifyStmt->execute();
    
    echo json_encode([
        'success' => true,
        'message' => 'User created successfully',
        'user' => [
            'id' => $newUserId,
            'name' => $name,
            'email' => $email,
            'role' => $role,
            'permissions' => $permissions,
            'profile_image' => $profileImage,
            'email_verified' => false
        ]
    ]);
    exit;
}

// PUT - Update user
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $userId = intval($data['id'] ?? 0);
    $name = $data['name'] ?? null;
    $email = $data['email'] ?? null;
    $role = $data['role'] ?? null;
    $permissions = $data['permissions'] ?? null;
    $profileImage = array_key_exists('profile_image', $data) ? $data['profile_image'] : null;
    $password = $data['password'] ?? null;
    $passwordChangeRequested = array_key_exists('password_change_requested', $data) ? (bool)$data['password_change_requested'] : null;
    
    if (!$userId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'User ID is required']);
        exit;
    }
    
    // Check if user exists and is not trying to modify deletable status
    $checkStmt = $mysqli->prepare('SELECT id, is_deletable FROM users WHERE id = ?');
    $checkStmt->bind_param('i', $userId);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }
    
    $updates = [];
    $params = [];
    $types = '';
    
    if ($name !== null) {
        $updates[] = 'name = ?';
        $params[] = $name;
        $types .= 's';
    }
    
    if ($email !== null) {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid email format']);
            exit;
        }
        $updates[] = 'email = ?';
        $params[] = $email;
        $types .= 's';
    }
    
    if ($role !== null) {
        $updates[] = 'role = ?';
        $params[] = $role;
        $types .= 's';
    }
    
    if ($permissions !== null) {
        $updates[] = 'permissions = ?';
        $params[] = json_encode($permissions);
        $types .= 's';
    }

    if (array_key_exists('profile_image', $data)) {
        $updates[] = 'profile_image = ?';
        $params[] = $profileImage === null ? '' : (string)$profileImage;
        $types .= 's';
    }

    if ($password !== null && trim((string)$password) !== '') {
        $updates[] = 'password_hash = ?';
        $params[] = password_hash(trim((string)$password), PASSWORD_BCRYPT);
        $types .= 's';
        $updates[] = 'password_change_requested = ?';
        $params[] = 0;
        $types .= 'i';
    }

    if ($passwordChangeRequested !== null) {
        $updates[] = 'password_change_requested = ?';
        $params[] = $passwordChangeRequested ? 1 : 0;
        $types .= 'i';
    }
    
    if (empty($updates)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No fields to update']);
        exit;
    }
    
    $params[] = $userId;
    $types .= 'i';
    
    $query = 'UPDATE users SET ' . implode(', ', $updates) . ' WHERE id = ?';
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param($types, ...$params);
    
    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $mysqli->error]);
        exit;
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'User updated successfully'
    ]);
    exit;
}

// DELETE - Delete user (cannot delete users with is_deletable = FALSE)
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $userId = intval($data['id'] ?? 0);
    
    if (!$userId) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'User ID is required']);
        exit;
    }
    
    // Check if user can be deleted
    $checkStmt = $mysqli->prepare('SELECT id, is_deletable, email FROM users WHERE id = ?');
    $checkStmt->bind_param('i', $userId);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }
    
    $user = $result->fetch_assoc();
    
    if (!$user['is_deletable']) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'This user cannot be deleted']);
        exit;
    }
    
    $deleteStmt = $mysqli->prepare('DELETE FROM users WHERE id = ?');
    $deleteStmt->bind_param('i', $userId);
    
    if (!$deleteStmt->execute()) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error']);
        exit;
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'User deleted successfully'
    ]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);

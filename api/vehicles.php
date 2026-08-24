<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') {
    exit(0);
}

function requireAdmin() {
    $sessionHeader = $_SERVER['HTTP_X_SESSION_ID'] ?? null;
    if ($sessionHeader) {
        session_id($sessionHeader);
    }
    session_set_cookie_params([
        'secure' => false,
        'httponly' => true,
        'samesite' => 'None',
        'path' => '/'
    ]);
    session_start();

    if (empty($_SESSION['admin_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit;
    }
}

if ($method === 'GET') {
    $result = $mysqli->query('SELECT id, name, image, details, status FROM vehicles ORDER BY created_at DESC');
    $vehicles = [];
    while ($row = $result->fetch_assoc()) {
        $vehicles[] = $row;
    }
    echo json_encode(['success' => true, 'vehicles' => $vehicles]);
    exit;
}

if ($method === 'POST') {
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $name = trim($data['name'] ?? '');
    $image = trim($data['image'] ?? '');
    $details = trim($data['details'] ?? '');
    $status = trim($data['status'] ?? 'active');

    if ($name === '') {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Vehicle name is required']);
        exit;
    }

    $stmt = $mysqli->prepare('INSERT INTO vehicles (name, image, details, status) VALUES (?, ?, ?, ?)');
    $stmt->bind_param('ssss', $name, $image, $details, $status);
    $stmt->execute();
    $id = $mysqli->insert_id;
    $stmt->close();

    echo json_encode(['success' => true, 'vehicle' => ['id' => $id, 'name' => $name, 'image' => $image, 'details' => $details, 'status' => $status]]);
    exit;
}

if ($method === 'PUT') {
    requireAdmin();
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true) ?? [];
    $id = intval($data['id'] ?? 0);
    $name = trim($data['name'] ?? '');
    $image = trim($data['image'] ?? '');
    $details = trim($data['details'] ?? '');
    $status = trim($data['status'] ?? 'active');

    if ($id <= 0 || $name === '') {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid vehicle data']);
        exit;
    }

    $stmt = $mysqli->prepare('UPDATE vehicles SET name = ?, image = ?, details = ?, status = ? WHERE id = ?');
    $stmt->bind_param('ssssi', $name, $image, $details, $status, $id);
    $stmt->execute();
    $stmt->close();

    echo json_encode(['success' => true, 'vehicle' => ['id' => $id, 'name' => $name, 'image' => $image, 'details' => $details, 'status' => $status]]);
    exit;
}

if ($method === 'DELETE') {
    requireAdmin();
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true) ?? [];
    $id = intval($data['id'] ?? 0);

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid vehicle id']);
        exit;
    }

    $stmt = $mysqli->prepare('DELETE FROM vehicles WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $stmt->close();

    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);

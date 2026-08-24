<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') {
    exit(0);
}

function getAccessKeys($mysqli) {
    $stmt = $mysqli->prepare('SELECT value FROM form_settings WHERE name = ? LIMIT 1');
    $name = 'access_keys';
    $stmt->bind_param('s', $name);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->close();

    if (!$row || !$row['value']) {
        return [
            'contactKeys' => [],
            'bookingKeys' => [],
        ];
    }

    $parsed = json_decode($row['value'], true);
    if (!is_array($parsed)) {
        return [
            'contactKeys' => [],
            'bookingKeys' => [],
        ];
    }

    $contactKeys = [];
    $bookingKeys = [];

    if (!empty($parsed['contactKeys']) && is_array($parsed['contactKeys'])) {
        $contactKeys = $parsed['contactKeys'];
    } elseif (!empty($parsed['contact']) && is_string($parsed['contact'])) {
        $contactKeys = [$parsed['contact']];
    } elseif (!empty($parsed['contactBackup']) && is_string($parsed['contactBackup'])) {
        $contactKeys = [$parsed['contactBackup']];
    }

    if (!empty($parsed['bookingKeys']) && is_array($parsed['bookingKeys'])) {
        $bookingKeys = $parsed['bookingKeys'];
    } elseif (!empty($parsed['booking']) && is_string($parsed['booking'])) {
        $bookingKeys = [$parsed['booking']];
    } elseif (!empty($parsed['bookingBackup']) && is_string($parsed['bookingBackup'])) {
        $bookingKeys = [$parsed['bookingBackup']];
    }

    return [
        'contactKeys' => array_values(array_filter(array_map('trim', $contactKeys))),
        'bookingKeys' => array_values(array_filter(array_map('trim', $bookingKeys))),
    ];
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
    $accessKeys = getAccessKeys($mysqli);
    echo json_encode([ 'success' => true, 'accessKeys' => $accessKeys ]);
    exit;
}

if ($method === 'POST') {
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $accessKeys = $data['accessKeys'] ?? null;

    if (!is_array($accessKeys)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid access key payload']);
        exit;
    }

    $prepared = json_encode([
        'contactKeys' => array_values(array_filter(array_map('trim', $accessKeys['contactKeys'] ?? []))),
        'bookingKeys' => array_values(array_filter(array_map('trim', $accessKeys['bookingKeys'] ?? []))),
    ]);

    $stmt = $mysqli->prepare("INSERT INTO form_settings (name, value) VALUES ('access_keys', ?) ON DUPLICATE KEY UPDATE value = VALUES(value)");
    $stmt->bind_param('s', $prepared);
    $stmt->execute();
    $stmt->close();

    echo json_encode(['success' => true, 'accessKeys' => json_decode($prepared, true)]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);

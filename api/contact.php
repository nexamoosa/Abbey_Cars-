<?php
require_once 'db.php';
$mysqli->query("ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS status ENUM('pending','approved') NOT NULL DEFAULT 'pending'");
$mysqli->query("ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS deleted_at DATETIME DEFAULT NULL");

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

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $first_name = trim($data['first_name'] ?? '');
    $last_name = trim($data['last_name'] ?? '');
    $email = trim($data['email'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $message = trim($data['message'] ?? '');

    if ($first_name === '' || $last_name === '' || $email === '' || $phone === '' || $message === '') {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required contact fields']);
        exit;
    }

    $stmt = $mysqli->prepare('INSERT INTO contact_submissions (first_name, last_name, email, phone, message) VALUES (?, ?, ?, ?, ?)');
    $stmt->bind_param('sssss', $first_name, $last_name, $email, $phone, $message);
    $stmt->execute();
    $stmt->close();
    // create admin notification
    $title = 'New contact message';
    $shortName = $first_name ? ($first_name . ($last_name ? ' ' . $last_name : '')) : 'Guest';
    $notifMsg = "{$shortName} sent a contact message: " . (strlen($message) > 120 ? substr($message,0,120) . '...' : $message);
    $ins = $mysqli->prepare('INSERT INTO notifications (type, title, message, reference_id, reference_type, is_read) VALUES (?, ?, ?, ?, ?, 0)');
    $type = 'contact';
    $referenceId = null;
    $refType = 'contact';
    if ($ins) {
        $ins->bind_param('sssis', $type, $title, $notifMsg, $referenceId, $refType);
        $ins->execute();
        $ins->close();
    }

    echo json_encode(['success' => true, 'message' => 'Contact saved']);
    exit;
}

if ($method === 'GET') {
    requireAdmin();
    $view = ($_GET['status'] ?? 'active') === 'trashed' ? 'WHERE deleted_at IS NOT NULL' : 'WHERE deleted_at IS NULL';
    $result = $mysqli->query('SELECT id, first_name, last_name, email, phone, message, status, deleted_at, created_at FROM contact_submissions ' . $view . ' ORDER BY created_at DESC');
    $submissions = [];
    while ($row = $result->fetch_assoc()) {
        $submissions[] = $row;
    }
    echo json_encode(['success' => true, 'submissions' => $submissions]);
    exit;
}

if ($method === 'PUT') {
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = intval($data['id'] ?? 0);
    $action = $data['action'] ?? 'status';
    if ($action === 'restore') {
        $stmt = $mysqli->prepare('UPDATE contact_submissions SET deleted_at = NULL WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $stmt->close();
        echo json_encode(['success' => true]);
        exit;
    }
    $status = ($data['status'] ?? '') === 'approved' ? 'approved' : 'pending';
    if ($action === 'update') {
        $first = trim($data['first_name'] ?? '');
        $last = trim($data['last_name'] ?? '');
        $email = trim($data['email'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $message = trim($data['message'] ?? '');
        if ($first === '' || $last === '' || $email === '' || $phone === '' || $message === '') { http_response_code(400); echo json_encode(['success'=>false,'message'=>'All contact fields are required']); exit; }
        $stmt = $mysqli->prepare('UPDATE contact_submissions SET first_name = ?, last_name = ?, email = ?, phone = ?, message = ?, status = ? WHERE id = ?');
        $stmt->bind_param('ssssssi', $first, $last, $email, $phone, $message, $status, $id);
        $stmt->execute();
        $stmt->close();
        echo json_encode(['success' => true]);
        exit;
    }
    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid contact submission']);
        exit;
    }
    $stmt = $mysqli->prepare('UPDATE contact_submissions SET status = ? WHERE id = ?');
    $stmt->bind_param('si', $status, $id);
    $stmt->execute();
    $stmt->close();
    echo json_encode(['success' => true, 'status' => $status]);
    exit;
}

if ($method === 'DELETE') {
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = intval($data['id'] ?? 0);
    if ($id <= 0) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid contact submission']); exit; }
    if (!empty($data['permanent'])) {
        $stmt = $mysqli->prepare('DELETE FROM contact_submissions WHERE id = ?');
    } else {
        $stmt = $mysqli->prepare('UPDATE contact_submissions SET deleted_at = NOW() WHERE id = ?');
    }
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $stmt->close();
    echo json_encode(['success'=>true]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);

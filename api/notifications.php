<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') exit(0);

function requireAdmin() {
    $sessionHeader = $_SERVER['HTTP_X_SESSION_ID'] ?? null;
    if ($sessionHeader) session_id($sessionHeader);
    session_set_cookie_params(['secure'=>false,'httponly'=>true,'samesite'=>'None','path'=>'/']);
    session_start();
    if (empty($_SESSION['admin_id'])) { http_response_code(401); echo json_encode(['success'=>false,'message'=>'Unauthorized']); exit; }
}

if ($method === 'GET') {
    // ?unread=1 or ?limit=20
    $unread = isset($_GET['unread']) && $_GET['unread'] === '1';
    $limit = intval($_GET['limit'] ?? 50);
    if ($limit <= 0) $limit = 50;

    // if count=1 return unread count
    if (isset($_GET['count']) && $_GET['count'] === '1') {
        $res = $mysqli->query('SELECT COUNT(*) AS c FROM notifications WHERE is_read = 0');
        $row = $res->fetch_assoc();
        echo json_encode(['success'=>true,'unread'=>intval($row['c'])]);
        exit;
    }

    $where = $unread ? 'WHERE is_read = 0' : '';
    $res = $mysqli->query('SELECT * FROM notifications ' . $where . ' ORDER BY created_at DESC LIMIT ' . $limit);
    $out = [];
    while ($r = $res->fetch_assoc()) $out[] = $r;
    echo json_encode(['success'=>true,'notifications'=>$out]);
    exit;
}

if ($method === 'POST') {
    // create notification (used by server-side too); allow unauthenticated for internal use
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $type = trim($data['type'] ?? 'general');
    $title = trim($data['title'] ?? '');
    $message = trim($data['message'] ?? '');
    $reference_id = intval($data['reference_id'] ?? 0) ?: null;
    $reference_type = trim($data['reference_type'] ?? null);

    if ($title === '') { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Title required']); exit; }
    $stmt = $mysqli->prepare('INSERT INTO notifications (type, title, message, reference_id, reference_type, is_read) VALUES (?, ?, ?, ?, ?, 0)');
    $stmt->bind_param('sssis', $type, $title, $message, $reference_id, $reference_type);
    $stmt->execute();
    $id = $mysqli->insert_id;
    $stmt->close();
    echo json_encode(['success'=>true,'id'=>$id]);
    exit;
}

if ($method === 'PUT') {
    // mark read/unread or mark all read
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    if (!empty($data['mark_all_read'])) {
        $mysqli->query('UPDATE notifications SET is_read = 1 WHERE is_read = 0');
        echo json_encode(['success'=>true]); exit;
    }
    // bulk update
    if (!empty($data['ids']) && is_array($data['ids'])) {
        $ids = array_filter(array_map('intval', $data['ids']));
        if (count($ids) === 0) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid ids']); exit; }
        $is_read = !empty($data['is_read']) ? 1 : 0;
        $in = implode(',', $ids);
        $mysqli->query("UPDATE notifications SET is_read = {$is_read} WHERE id IN ({$in})");
        echo json_encode(['success'=>true]); exit;
    }
    $id = intval($data['id'] ?? 0);
    if ($id <= 0) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid id']); exit; }
    $is_read = !empty($data['is_read']) ? 1 : 0;
    $stmt = $mysqli->prepare('UPDATE notifications SET is_read = ? WHERE id = ?');
    $stmt->bind_param('ii', $is_read, $id);
    $stmt->execute();
    $stmt->close();
    echo json_encode(['success'=>true]);
    exit;
}

if ($method === 'DELETE') {
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    if (!empty($data['ids']) && is_array($data['ids'])) {
        $ids = array_filter(array_map('intval', $data['ids']));
        if (count($ids) === 0) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid ids']); exit; }
        $in = implode(',', $ids);
        $mysqli->query("DELETE FROM notifications WHERE id IN ({$in})");
        echo json_encode(['success'=>true]); exit;
    }
    $id = intval($data['id'] ?? 0);
    if ($id <= 0) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid id']); exit; }
    $stmt = $mysqli->prepare('DELETE FROM notifications WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $stmt->close();
    echo json_encode(['success'=>true]);
    exit;
}

http_response_code(405);
echo json_encode(['success'=>false,'message'=>'Method not allowed']);

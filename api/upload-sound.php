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

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['success'=>false,'message'=>'Method not allowed']);
    exit;
}

requireAdmin();

if (empty($_FILES['sound'])) {
    http_response_code(400);
    echo json_encode(['success'=>false,'message'=>'No file uploaded']);
    exit;
}

$f = $_FILES['sound'];
if ($f['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['success'=>false,'message'=>'Upload error']);
    exit;
}

$allowed = ['audio/mpeg','audio/wav','audio/ogg','audio/mp3','audio/x-wav','audio/webm'];
$mime = mime_content_type($f['tmp_name']);
if (!in_array($mime, $allowed)) {
    // allow based on extension as fallback
    $ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ['mp3','wav','ogg','webm'])) {
        http_response_code(400);
        echo json_encode(['success'=>false,'message'=>'Invalid audio file type']);
        exit;
    }
}

$uploadsDir = __DIR__ . '/../uploads/notification-sounds';
if (!is_dir($uploadsDir)) mkdir($uploadsDir, 0755, true);

$safe = bin2hex(random_bytes(8)) . '-' . preg_replace('/[^a-zA-Z0-9._-]/', '-', basename($f['name']));
$target = $uploadsDir . '/' . $safe;
if (!move_uploaded_file($f['tmp_name'], $target)) {
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>'Failed to save file']);
    exit;
}

$publicPath = '/uploads/notification-sounds/' . $safe;
echo json_encode(['success'=>true,'url'=>$publicPath]);
exit;

<?php
require_once 'db.php';

// SSE endpoint for admin notifications. Use session id via header X-Session-Id or GET param session_id.
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');

// Authenticate admin via session id (GET or header)
$sessionId = $_GET['session_id'] ?? $_SERVER['HTTP_X_SESSION_ID'] ?? null;
if ($sessionId) session_id($sessionId);
session_set_cookie_params(['secure'=>false,'httponly'=>true,'samesite'=>'None','path'=>'/']);
session_start();
if (empty($_SESSION['admin_id'])) {
    http_response_code(401);
    echo "event: error\n";
    echo "data: {\"message\": \"Unauthorized\"}\n\n";
    exit;
}

// Release the session lock so other admin requests do not block while SSE is open.
session_write_close();

// Prevent the script from timing out
set_time_limit(0);
ignore_user_abort(true);

$lastId = intval($_GET['last_id'] ?? 0);

// Flush helper
function sse_send($event, $data) {
    echo "event: {$event}\n";
    echo 'data: ' . json_encode($data) . "\n\n";
    @ob_flush();
    @flush();
}

// initial heartbeat
sse_send('connected', ['message' => 'connected']);

while (!connection_aborted()) {
    $res = $mysqli->query('SELECT * FROM notifications WHERE id > ' . intval($lastId) . ' ORDER BY id ASC LIMIT 50');
    $sent = 0;
    while ($row = $res->fetch_assoc()) {
        sse_send('notification', $row);
        $lastId = max($lastId, intval($row['id']));
        $sent++;
    }

    if ($sent === 0) {
        // heartbeat to keep connection alive
        echo ": ping\n\n";
        @ob_flush();
        @flush();
    }

    // short sleep
    sleep(2);
}

exit;

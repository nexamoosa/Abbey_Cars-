<?php
require_once 'db.php';
require_once 'google-sheets.php';

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
    $pickup_location = trim($data['pickup_location'] ?? '');
    $dropoff_location = trim($data['dropoff_location'] ?? '');
    $passengers = intval($data['passengers'] ?? 0);
    $luggage = trim($data['luggage'] ?? '');
    $datetime = trim($data['datetime'] ?? '');
    $vehicle_id = intval($data['vehicle_id'] ?? 0);
    $customer_name = trim($data['customer_name'] ?? '');
    $phone = trim($data['phone'] ?? '');
    $email = trim($data['email'] ?? '');

    if ($pickup_location === '' || $dropoff_location === '' || $passengers <= 0 || $luggage === '' || $datetime === '' || $vehicle_id <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Missing required booking fields']);
        exit;
    }

    $stmt = $mysqli->prepare('INSERT INTO bookings (pickup_location, dropoff_location, passengers, luggage, datetime, vehicle_id, customer_name, phone, email, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $message = trim($data['message'] ?? '');
    $stmt->bind_param('ssisisssss', $pickup_location, $dropoff_location, $passengers, $luggage, $datetime, $vehicle_id, $customer_name, $phone, $email, $message);
    $stmt->execute();
    $bookingId = $mysqli->insert_id;
    $stmt->close();

    syncBookingToGoogleSheets([
        'id' => $bookingId,
        'pickup_location' => $pickup_location,
        'dropoff_location' => $dropoff_location,
        'passengers' => $passengers,
        'luggage' => $luggage,
        'datetime' => $datetime,
        'vehicle_id' => $vehicle_id,
        'customer_name' => $customer_name,
        'phone' => $phone,
        'email' => $email,
        'message' => $message,
        'status' => 'pending',
    ]);

    // create admin notification
    $title = 'New booking request';
    $shortName = $customer_name ?: ($phone ?: 'Guest');
    $notifMsg = "{$shortName} requested a booking for vehicle ID {$vehicle_id} on {$datetime}.";
    $ins = $mysqli->prepare('INSERT INTO notifications (type, title, message, reference_id, reference_type, is_read) VALUES (?, ?, ?, ?, ?, 0)');
    $type = 'booking';
    $refType = 'booking';
    if ($ins) {
        $ins->bind_param('sssis', $type, $title, $notifMsg, $bookingId, $refType);
        $ins->execute();
        $ins->close();
    }

    echo json_encode(['success' => true, 'message' => 'Booking saved']);
    exit;
}

if ($method === 'GET') {
    requireAdmin();
    $status = trim($_GET['status'] ?? 'active');
    $where = '';

    if ($status === 'trashed') {
        $where = 'WHERE b.deleted_at IS NOT NULL';
    } else {
        $where = 'WHERE b.deleted_at IS NULL';
    }

    $query = 'SELECT b.id, b.pickup_location, b.dropoff_location, b.passengers, b.luggage, b.datetime, b.customer_name, b.phone, b.email, b.status, b.deleted_at, b.created_at, v.name AS vehicle_name FROM bookings b LEFT JOIN fleet_vehicles v ON b.vehicle_id = v.id ' . $where . ' ORDER BY b.created_at DESC';
    $result = $mysqli->query($query);
    if (!$result) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $mysqli->error]);
        exit;
    }

    $bookings = [];
    while ($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
    echo json_encode(['success' => true, 'bookings' => $bookings]);
    exit;
}

if ($method === 'PUT') {
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = intval($data['id'] ?? 0);
    $action = trim($data['action'] ?? '');

    if ($id <= 0 || !in_array($action, ['approve', 'cancel', 'trash', 'restore'], true)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        exit;
    }

    if ($action === 'approve') {
        $stmt = $mysqli->prepare('UPDATE bookings SET status = ? WHERE id = ?');
        $statusValue = 'approved';
        $stmt->bind_param('si', $statusValue, $id);
        $stmt->execute();
        $stmt->close();
    } elseif ($action === 'cancel') {
        $stmt = $mysqli->prepare('UPDATE bookings SET status = ? WHERE id = ?');
        $statusValue = 'cancelled';
        $stmt->bind_param('si', $statusValue, $id);
        $stmt->execute();
        $stmt->close();
    } elseif ($action === 'trash') {
        $stmt = $mysqli->prepare('UPDATE bookings SET deleted_at = NOW() WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $stmt->close();
    } elseif ($action === 'restore') {
        $stmt = $mysqli->prepare('UPDATE bookings SET deleted_at = NULL WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $stmt->close();
    }

    echo json_encode(['success' => true]);
    exit;
}

if ($method === 'DELETE') {
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = intval($data['id'] ?? 0);

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid booking id']);
        exit;
    }

    $stmt = $mysqli->prepare('DELETE FROM bookings WHERE id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $stmt->close();

    echo json_encode(['success' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed']);

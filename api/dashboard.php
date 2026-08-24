<?php
require_once 'db.php';

header('Content-Type: application/json');

// total bookings (all time)
$res = $mysqli->query('SELECT COUNT(*) AS c FROM bookings');
$row = $res->fetch_assoc();
$totalBookings = intval($row['c'] ?? 0);

// bookings this month
$res = $mysqli->query("SELECT COUNT(*) AS c FROM bookings WHERE created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')");
$row = $res->fetch_assoc();
$bookingsThisMonth = intval($row['c'] ?? 0);

// most popular car
$res = $mysqli->query('SELECT v.id, v.name, COUNT(b.id) AS bookings FROM fleet_vehicles v LEFT JOIN bookings b ON b.vehicle_id = v.id GROUP BY v.id ORDER BY bookings DESC LIMIT 1');
$most = $res->fetch_assoc();
$mostBooked = $most ? ['id' => intval($most['id']), 'name' => $most['name'], 'bookings' => intval($most['bookings'])] : null;

// blog posts count if table exists
$blogCount = 0;
$check = $mysqli->query("SHOW TABLES LIKE 'blog_posts'");
if ($check && $check->num_rows > 0) {
    $r = $mysqli->query('SELECT COUNT(*) AS c FROM blog_posts');
    $row = $r->fetch_assoc();
    $blogCount = intval($row['c'] ?? 0);
}

// contact submissions count
$res = $mysqli->query('SELECT COUNT(*) AS c FROM contact_submissions');
$row = $res->fetch_assoc();
$contactCount = intval($row['c'] ?? 0);

// fleet counts
$res = $mysqli->query("SELECT
    SUM(IF(deleted_at IS NULL, 1, 0)) AS listed,
    SUM(IF(status = 'available' AND deleted_at IS NULL, 1, 0)) AS available,
    SUM(IF(status = 'maintenance' AND deleted_at IS NULL, 1, 0)) AS maintenance
    FROM fleet_vehicles");
$row = $res->fetch_assoc();
$fleetListed = intval($row['listed'] ?? 0);
$fleetAvailable = intval($row['available'] ?? 0);
$fleetMaintenance = intval($row['maintenance'] ?? 0);

echo json_encode(['success' => true, 'summary' => [
    'total_bookings' => $totalBookings,
    'bookings_this_month' => $bookingsThisMonth,
    'most_booked' => $mostBooked,
    'blog_count' => $blogCount,
    'contact_submissions' => $contactCount,
    'fleet' => [
        'listed' => $fleetListed,
        'available' => $fleetAvailable,
        'maintenance' => $fleetMaintenance,
    ],
]]);

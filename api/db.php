<?php
header('Content-Type: application/json');
$origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:5173';
if (preg_match('/^https?:\/\/localhost(:[0-9]+)?$/', $origin)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: http://localhost:5173');
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, X-Session-Id');
header('Vary: Origin');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$host = '127.0.0.1';
$user = 'root';
$pass = '';
$dbname = 'abbey_cars';

$mysqli = new mysqli($host, $user, $pass, $dbname);

if ($mysqli->connect_error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'MySQL connection failed: ' . $mysqli->connect_error
    ]);
    exit;
}

$mysqli->set_charset('utf8mb4');

$usersTableCheck = $mysqli->query("SHOW TABLES LIKE 'users'");
if ($usersTableCheck && $usersTableCheck->num_rows === 0) {
    $mysqli->query("CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('admin', 'super_admin') DEFAULT 'admin',
        permissions JSON DEFAULT '{\"pages\": [\"dashboard\"]}',
        profile_image TEXT NULL,
        password_change_requested BOOLEAN DEFAULT FALSE,
        email_verified BOOLEAN DEFAULT FALSE,
        verification_token VARCHAR(255) NULL,
        verification_token_expires TIMESTAMP NULL,
        is_deletable BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
}

$addProfileImage = $mysqli->query("SHOW COLUMNS FROM users LIKE 'profile_image'");
if ($addProfileImage && $addProfileImage->num_rows === 0) {
    $mysqli->query("ALTER TABLE users ADD COLUMN profile_image TEXT NULL");
}
$addPasswordRequest = $mysqli->query("SHOW COLUMNS FROM users LIKE 'password_change_requested'");
if ($addPasswordRequest && $addPasswordRequest->num_rows === 0) {
    $mysqli->query("ALTER TABLE users ADD COLUMN password_change_requested BOOLEAN DEFAULT FALSE");
}

// Ensure the admins table exists, with a default administrator account.
$createTable = "CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
$mysqli->query($createTable);

$defaultEmail = 'admin@abbeycars.com';
$defaultName = 'Admin';
$defaultPassword = 'password';
$defaultHash = password_hash($defaultPassword, PASSWORD_DEFAULT);
$insertAdmin = $mysqli->prepare("INSERT INTO admins (name, email, password_hash) VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash);");
$insertAdmin->bind_param('sss', $defaultName, $defaultEmail, $defaultHash);
$insertAdmin->execute();
$insertAdmin->close();

$createFormSettings = "CREATE TABLE IF NOT EXISTS form_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
$mysqli->query($createFormSettings);

$createVehicles = "CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image MEDIUMTEXT,
    details TEXT,
    status ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
$mysqli->query($createVehicles);
$mysqli->query('ALTER TABLE vehicles MODIFY COLUMN image MEDIUMTEXT');

// Fleet vehicles table (separate from the simple vehicles table)
$createFleetVehicles = "CREATE TABLE IF NOT EXISTS fleet_vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT NULL,
    rating DECIMAL(2,1) DEFAULT 5.0,
    passengers INT NOT NULL DEFAULT 4,
    hand_carries INT NOT NULL DEFAULT 2,
    bags INT NOT NULL DEFAULT 2,
    price_per_trip DECIMAL(10,2) DEFAULT NULL,
    status ENUM('available','maintenance','trashed') NOT NULL DEFAULT 'available',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
$mysqli->query($createFleetVehicles);

// Fleet vehicle images metadata
$createFleetImages = "CREATE TABLE IF NOT EXISTS fleet_vehicle_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    is_primary TINYINT(1) DEFAULT 0,
    sort_order INT DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES fleet_vehicles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
$mysqli->query($createFleetImages);

$createBookings = "CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pickup_location VARCHAR(255) NOT NULL,
    dropoff_location VARCHAR(255) NOT NULL,
    passengers INT NOT NULL,
    luggage VARCHAR(100) NOT NULL,
    datetime DATETIME NOT NULL,
    vehicle_id INT DEFAULT NULL,
    customer_name VARCHAR(255),
    phone VARCHAR(100),
    email VARCHAR(255),
    status ENUM('pending','approved','cancelled') NOT NULL DEFAULT 'pending',
    deleted_at DATETIME DEFAULT NULL,
    message TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES fleet_vehicles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
$mysqli->query($createBookings);
$fkResult = $mysqli->query("SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'vehicle_id' AND REFERENCED_TABLE_NAME = 'vehicles'");
if ($fkResult && $fkResult->num_rows) {
    while ($fk = $fkResult->fetch_assoc()) {
        $name = $fk['CONSTRAINT_NAME'];
        $mysqli->query("ALTER TABLE bookings DROP FOREIGN KEY `{$name}`");
    }
}
$constraintCheck = $mysqli->query("SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'bookings' AND CONSTRAINT_NAME = 'bookings_vehicle_fk'");
if (!$constraintCheck || $constraintCheck->num_rows === 0) {
    $mysqli->query("ALTER TABLE bookings ADD CONSTRAINT bookings_vehicle_fk FOREIGN KEY (vehicle_id) REFERENCES fleet_vehicles(id) ON DELETE SET NULL");
}
$mysqli->query("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS status ENUM('pending','approved','cancelled') NOT NULL DEFAULT 'pending'");
$mysqli->query("ALTER TABLE bookings ADD COLUMN IF NOT EXISTS deleted_at DATETIME DEFAULT NULL");

// Notifications table for admin bell and history
$createNotifications = "CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    reference_id INT DEFAULT NULL,
    reference_type VARCHAR(100) DEFAULT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
$mysqli->query($createNotifications);

$createContactSubmissions = "CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
$mysqli->query($createContactSubmissions);

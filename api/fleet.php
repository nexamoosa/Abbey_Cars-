<?php
require_once 'db.php';

// Ensure image meta and usage tables exist
$mysqli->query("CREATE TABLE IF NOT EXISTS fleet_vehicle_image_meta (
    image_id INT PRIMARY KEY,
    meta_title VARCHAR(255) DEFAULT NULL,
    meta_description TEXT DEFAULT NULL,
    alt_text VARCHAR(255) DEFAULT NULL
)") ;
$mysqli->query("CREATE TABLE IF NOT EXISTS fleet_image_usages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_id INT NOT NULL,
    location VARCHAR(64) NOT NULL,
    reference_id INT DEFAULT 0,
    reference_name VARCHAR(255) DEFAULT NULL,
    UNIQUE KEY ux_image_location_ref (image_id, location, reference_id, reference_name)
)") ;
$mysqli->query("ALTER TABLE fleet_image_usages ADD COLUMN IF NOT EXISTS reference_name VARCHAR(255) DEFAULT NULL");
$mysqli->query("ALTER TABLE fleet_image_usages DROP INDEX IF EXISTS ux_image_location_ref");
$mysqli->query("ALTER TABLE fleet_image_usages ADD UNIQUE KEY ux_image_location_ref (image_id, location, reference_id, reference_name)");

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

function validateImage($file) {
    $allowed = ['image/jpeg', 'image/png', 'image/webp'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    if (!in_array($mime, $allowed, true)) return false;
    if ($file['size'] > 5 * 1024 * 1024) return false; // 5MB limit
    return true;
}

function saveUploadedImage($file) {
    $uploadsDir = __DIR__ . '/../uploads/fleet-images';
    if (!is_dir($uploadsDir)) mkdir($uploadsDir, 0755, true);
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION) ?: 'jpg';
    $safeName = preg_replace('/[^A-Za-z0-9\-_.]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
    $filename = $safeName . '-' . time() . '-' . bin2hex(random_bytes(6)) . '.' . $ext;
    $target = $uploadsDir . '/' . $filename;
    if (!move_uploaded_file($file['tmp_name'], $target)) return null;
    // Return web-accessible path
    $publicPath = '/uploads/fleet-images/' . $filename;
    return ['file_name' => $filename, 'file_path' => $publicPath];
}

// Handle media listing first when requested (admin only)
if ($method === 'GET' && isset($_GET['media'])) {
    requireAdmin();
    $res = $mysqli->query('SELECT img.*, m.meta_title, m.meta_description, m.alt_text, v.name AS vehicle_name FROM fleet_vehicle_images img LEFT JOIN fleet_vehicle_image_meta m ON m.image_id = img.id LEFT JOIN fleet_vehicles v ON v.id = img.vehicle_id ORDER BY img.uploaded_at DESC');
    $out = [];
    $byPath = [];
    while ($r = $res->fetch_assoc()) {
        $u = $mysqli->query('SELECT u.location, u.reference_id, COALESCE(u.reference_name, v.name) AS reference_name FROM fleet_image_usages u LEFT JOIN fleet_vehicles v ON u.location = \'vehicle\' AND v.id = u.reference_id WHERE u.image_id = '.intval($r['id']));
        $us = [];
        while ($uu = $u->fetch_assoc()) $us[] = $uu;
        if ((int)$r['vehicle_id'] > 0) $us[] = ['location' => 'vehicle', 'reference_id' => (int)$r['vehicle_id'], 'reference_name' => $r['vehicle_name'] ?: null];
        $path = (string)$r['file_path'];
        if (!isset($byPath[$path])) {
            $r['usages'] = [];
            $r['usage_count'] = 0;
            $byPath[$path] = count($out);
            $out[] = $r;
        }
        $index = $byPath[$path];
        foreach ($us as $usage) {
            $usageKey = $usage['location'] . ':' . (int)$usage['reference_id'] . ':' . ($usage['reference_name'] ?? '');
            $known = array_map(static fn($item) => $item['location'] . ':' . (int)$item['reference_id'] . ':' . ($item['reference_name'] ?? ''), $out[$index]['usages']);
            if (!in_array($usageKey, $known, true)) $out[$index]['usages'][] = $usage;
        }
        $out[$index]['usage_count'] = count($out[$index]['usages']);
    }
    echo json_encode(['success'=>true,'media'=>$out]);
    exit;
}

// Record where a media image is used. The request must be handled separately
// from image uploads so FormData action=add_usage is not swallowed by the upload branch.
if ($method === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_usage') {
    requireAdmin();
    $imageId = intval($_POST['image_id'] ?? 0);
    $location = trim($_POST['location'] ?? '');
    $referenceId = intval($_POST['reference_id'] ?? 0);
    $referenceName = trim($_POST['reference_name'] ?? '') ?: null;
    if ($imageId <= 0 || $location === '') {
        http_response_code(400);
        echo json_encode(['success'=>false,'message'=>'Image and usage location are required']);
        exit;
    }
    $stmt = $mysqli->prepare('INSERT IGNORE INTO fleet_image_usages (image_id, location, reference_id, reference_name) VALUES (?, ?, ?, ?)');
    $stmt->bind_param('isis', $imageId, $location, $referenceId, $referenceName);
    $stmt->execute();
    $stmt->close();
    echo json_encode(['success'=>true]);
    exit;
}

if ($method === 'GET') {
    // list or get single
    $id = intval($_GET['id'] ?? 0);
    $status = trim($_GET['status'] ?? 'all');
    if ($id > 0) {
        $stmt = $mysqli->prepare('SELECT * FROM fleet_vehicles WHERE id = ? LIMIT 1');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $res = $stmt->get_result();
        $vehicle = $res->fetch_assoc();
        $stmt->close();
        if (!$vehicle) { echo json_encode(['success'=>false,'message'=>'Not found']); exit; }
        $imgs = $mysqli->query('SELECT img.*, m.meta_title, m.meta_description, m.alt_text FROM fleet_vehicle_images img LEFT JOIN fleet_vehicle_image_meta m ON m.image_id = img.id WHERE img.vehicle_id = '.intval($id).' ORDER BY img.sort_order, img.uploaded_at DESC');
        $images = [];
        while ($r = $imgs->fetch_assoc()) $images[] = $r;
        $vehicle['images'] = $images;
        echo json_encode(['success'=>true,'vehicle'=>$vehicle]);
        exit;
    }

    // list
    $where = '';
    if ($status === 'available') $where = "WHERE status = 'available' AND deleted_at IS NULL";
    elseif ($status === 'maintenance') $where = "WHERE status = 'maintenance' AND deleted_at IS NULL";
    elseif ($status === 'trashed') $where = "WHERE deleted_at IS NOT NULL";
    else $where = "WHERE deleted_at IS NULL";

    $query = 'SELECT DISTINCT v.*, COALESCE(b.bookings, 0) AS bookings, img.file_path AS image FROM fleet_vehicles v LEFT JOIN (' .
        'SELECT vehicle_id, COUNT(*) AS bookings FROM bookings GROUP BY vehicle_id' .
        ') b ON b.vehicle_id = v.id LEFT JOIN fleet_vehicle_images img ON img.vehicle_id = v.id AND img.is_primary = 1 ' .
        $where . ' ORDER BY v.created_at DESC';
    $result = $mysqli->query($query);
    if (!$result) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $mysqli->error]);
        exit;
    }

    $items = [];
    while ($row = $result->fetch_assoc()) $items[] = $row;
    echo json_encode(['success'=>true,'vehicles'=>$items]);
    exit;
}

// return all media (global + attached) with usages
if ($method === 'GET' && isset($_GET['media'])) {
    requireAdmin();
    $res = $mysqli->query('SELECT img.*, m.meta_title, m.meta_description, m.alt_text, v.name AS vehicle_name FROM fleet_vehicle_images img LEFT JOIN fleet_vehicle_image_meta m ON m.image_id = img.id LEFT JOIN fleet_vehicles v ON v.id = img.vehicle_id ORDER BY img.uploaded_at DESC');
    $out = [];
    while ($r = $res->fetch_assoc()) {
        // get usages
        $u = $mysqli->query('SELECT location, reference_id FROM fleet_image_usages WHERE image_id = '.intval($r['id']));
        $us = [];
        while ($uu = $u->fetch_assoc()) $us[] = $uu;
        $r['usages'] = $us;
        $r['usage_count'] = count($us);
        $out[] = $r;
    }
    echo json_encode(['success'=>true,'media'=>$out]);
    exit;
}

if ($method === 'POST') {
    // Support separate image uploads after the vehicle exists
    if (isset($_POST['action']) && $_POST['action'] === 'upload_image') {
        requireAdmin();
        $vehicleId = intval($_POST['vehicle_id'] ?? 0);
        // allow vehicle_id = 0 for global media (unattached)
        if (empty($_FILES['images'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'No images uploaded']);
            exit;
        }

        $files = $_FILES['images'];
        // determine if vehicle already has a primary image
        $hasPrimaryRes = $mysqli->query('SELECT COUNT(*) AS c FROM fleet_vehicle_images WHERE vehicle_id = '.intval($vehicleId).' AND is_primary = 1');
        $hasPrimaryRow = $hasPrimaryRes ? $hasPrimaryRes->fetch_assoc() : null;
        $hasPrimary = $hasPrimaryRow ? intval($hasPrimaryRow['c']) > 0 : false;
        for ($i = 0; $i < count($files['name']); $i++) {
            $file = ['name' => $files['name'][$i], 'tmp_name' => $files['tmp_name'][$i], 'size' => $files['size'][$i], 'error' => $files['error'][$i]];
            if ($file['error'] !== UPLOAD_ERR_OK) {
                continue;
            }
            if (!validateImage($file)) {
                continue;
            }
            // prevent uploading duplicate original filenames (use safe base match)
            $origBase = preg_replace('/[^A-Za-z0-9\-_.]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
            $like = $mysqli->real_escape_string($origBase) . '%';
            $dupRes = $mysqli->query("SELECT COUNT(*) AS c FROM fleet_vehicle_images WHERE file_name LIKE '" . $like . "'");
            $dupRow = $dupRes ? $dupRes->fetch_assoc() : null;
            if ($dupRow && intval($dupRow['c']) > 0) {
                // skip this file and report error immediately
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'An image with that name already exists: ' . $file['name']]);
                exit;
            }
            $saved = saveUploadedImage($file);
            if (!$saved) {
                continue;
            }
            // if vehicle had no primary image, mark the first successfully uploaded file as primary
            $isPrimary = (!$hasPrimary && $i === 0) ? 1 : 0;
            $order = $i;
            $stmt = $mysqli->prepare('INSERT INTO fleet_vehicle_images (vehicle_id, file_name, file_path, is_primary, sort_order) VALUES (?, ?, ?, ?, ?)');
            $stmt->bind_param('issii', $vehicleId, $saved['file_name'], $saved['file_path'], $isPrimary, $order);
            $stmt->execute();
            $stmt->close();
            if ($isPrimary) $hasPrimary = true;
        }

        echo json_encode(['success' => true]);
        exit;
    }

    // Support multipart/form-data for vehicle creation
    if (strpos($_SERVER['CONTENT_TYPE'] ?? '', 'multipart/form-data') !== false) {
        requireAdmin();
        $name = trim($_POST['name'] ?? '');
        if ($name === '') { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Name required']); exit; }
        $category = trim($_POST['category'] ?? '');
        $rating = isset($_POST['rating']) ? floatval($_POST['rating']) : 5.0;
        $passengers = isset($_POST['passengers']) ? intval($_POST['passengers']) : 4;
        $hand_carries = isset($_POST['hand_carries']) ? intval($_POST['hand_carries']) : 2;
        $bags = isset($_POST['bags']) ? intval($_POST['bags']) : 2;
        $price = isset($_POST['price_per_trip']) ? $_POST['price_per_trip'] : null;

        // server-side numeric validation
        if (!is_numeric($rating) || $rating < 0 || $rating > 5) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid rating']); exit; }
        if (!is_numeric($passengers) || $passengers <= 0) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid passengers count']); exit; }
        if (!is_numeric($hand_carries) || $hand_carries < 0) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid hand_carries']); exit; }
        if (!is_numeric($bags) || $bags < 0) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid bags']); exit; }
        if ($price !== null && $price !== '' && !is_numeric($price)) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid price_per_trip']); exit; }
        $status = in_array($_POST['status'] ?? 'available', ['available','maintenance','trashed'], true) ? $_POST['status'] : 'available';
        $description = trim($_POST['description'] ?? '');

        $stmt = $mysqli->prepare('INSERT INTO fleet_vehicles (name, category, rating, passengers, hand_carries, bags, price_per_trip, status, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->bind_param('ssdiiiiss', $name, $category, $rating, $passengers, $hand_carries, $bags, $price, $status, $description);
        $stmt->execute();
        $vehicleId = $mysqli->insert_id;
        $stmt->close();

        // handle files
        if (!empty($_FILES['images'])) {
            $files = $_FILES['images'];
            for ($i = 0; $i < count($files['name']); $i++) {
                $file = ['name'=>$files['name'][$i],'tmp_name'=>$files['tmp_name'][$i],'size'=>$files['size'][$i],'error'=>$files['error'][$i]];
                if ($file['error'] !== UPLOAD_ERR_OK) continue;
                if (!validateImage($file)) continue;
                $saved = saveUploadedImage($file);
                if (!$saved) continue;
                $isPrimary = ($i === 0) ? 1 : 0;
                $stmt = $mysqli->prepare('INSERT INTO fleet_vehicle_images (vehicle_id, file_name, file_path, is_primary, sort_order) VALUES (?, ?, ?, ?, ?)');
                $order = $i;
                $stmt->bind_param('issii', $vehicleId, $saved['file_name'], $saved['file_path'], $isPrimary, $order);
                $stmt->execute();
                $stmt->close();
            }
        }

        echo json_encode(['success'=>true,'vehicle_id'=>$vehicleId]);
        exit;
    }

    // fallback: JSON body
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    requireAdmin();
    $name = trim($data['name'] ?? '');
    if ($name === '') { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Name required']); exit; }
    $category = trim($data['category'] ?? '');
    $rating = isset($data['rating']) ? floatval($data['rating']) : 5.0;
    $passengers = isset($data['passengers']) ? intval($data['passengers']) : 4;
    $hand_carries = isset($data['hand_carries']) ? intval($data['hand_carries']) : 2;
    $bags = isset($data['bags']) ? intval($data['bags']) : 2;
    $price = isset($data['price_per_trip']) ? $data['price_per_trip'] : null;

    // server-side numeric validation
    if (!is_numeric($rating) || $rating < 0 || $rating > 5) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid rating']); exit; }
    if (!is_numeric($passengers) || $passengers <= 0) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid passengers count']); exit; }
    if (!is_numeric($hand_carries) || $hand_carries < 0) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid hand_carries']); exit; }
    if (!is_numeric($bags) || $bags < 0) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid bags']); exit; }
    if ($price !== null && $price !== '' && !is_numeric($price)) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid price_per_trip']); exit; }
    $status = in_array($data['status'] ?? 'available', ['available','maintenance','trashed'], true) ? $data['status'] : 'available';
    $description = trim($data['description'] ?? '');

    $stmt = $mysqli->prepare('INSERT INTO fleet_vehicles (name, category, rating, passengers, hand_carries, bags, price_per_trip, status, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->bind_param('ssdiiiiss', $name, $category, $rating, $passengers, $hand_carries, $bags, $price, $status, $description);
    $stmt->execute();
    $vehicleId = $mysqli->insert_id;
    $stmt->close();

    echo json_encode(['success'=>true,'vehicle_id'=>$vehicleId]);
    exit;
}

if ($method === 'PUT' && (!isset($_GET['action']) || $_GET['action'] !== 'set_primary')) {
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    // support restore action
    if (!empty($data['restore'])) {
        $id = intval($data['id'] ?? 0);
        if ($id <= 0) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid id']); exit; }
        $stmt = $mysqli->prepare('UPDATE fleet_vehicles SET deleted_at = NULL WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $stmt->close();
        echo json_encode(['success'=>true]);
        exit;
    }
    $id = intval($data['id'] ?? 0);
    if ($id <= 0) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid id']); exit; }
    $fields = [];
    $types = '';
    $values = [];
    $allowed = ['name','category','rating','passengers','hand_carries','bags','price_per_trip','status','description'];
    foreach ($allowed as $f) {
        if (array_key_exists($f, $data)) { $fields[] = "$f = ?"; $values[] = $data[$f]; }
    }
    if ($fields) {
        $sql = 'UPDATE fleet_vehicles SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $values[] = $id;
        // build types dynamically (simplified)
        // perform server-side validation for numeric fields if present
        if (array_key_exists('rating', $data) && (!is_numeric($data['rating']) || $data['rating'] < 0 || $data['rating'] > 5)) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid rating']); exit; }
        if (array_key_exists('passengers', $data) && (!is_numeric($data['passengers']) || intval($data['passengers']) <= 0)) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid passengers']); exit; }
        if (array_key_exists('hand_carries', $data) && (!is_numeric($data['hand_carries']) || intval($data['hand_carries']) < 0)) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid hand_carries']); exit; }
        if (array_key_exists('bags', $data) && (!is_numeric($data['bags']) || intval($data['bags']) < 0)) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid bags']); exit; }
        if (array_key_exists('price_per_trip', $data) && $data['price_per_trip'] !== null && $data['price_per_trip'] !== '' && !is_numeric($data['price_per_trip'])) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid price_per_trip']); exit; }
        $types = str_repeat('s', count($values));
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param($types, ...$values);
        $stmt->execute();
        $stmt->close();
    }
    echo json_encode(['success'=>true]);
    exit;
}

// reorder images for a vehicle
if ($method === 'PUT' && isset($_GET['action']) && $_GET['action'] === 'reorder_images') {
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $vehicleId = intval($data['vehicle_id'] ?? 0);
    $order = $data['order'] ?? [];
    if ($vehicleId <= 0 || !is_array($order)) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid parameters']); exit; }
    $i = 0;
    $stmt = $mysqli->prepare('UPDATE fleet_vehicle_images SET sort_order = ? WHERE id = ? AND vehicle_id = ?');
    foreach ($order as $imgId) {
        $imgId = intval($imgId);
        $stmt->bind_param('iii', $i, $imgId, $vehicleId);
        $stmt->execute();
        $i++;
    }
    $stmt->close();
    echo json_encode(['success'=>true]);
    exit;
}

if ($method === 'DELETE') {
    // If this DELETE request is targeting an image (query param image_id),
    // allow the dedicated image-delete handler below to process it.
    if (isset($_GET['image_id'])) {
        // fall through to the image delete handler later
    } else {
        requireAdmin();
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $id = intval($data['id'] ?? 0);
        $permanent = !empty($data['permanent']);
        if ($id <= 0) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid id']); exit; }
        if ($permanent) {
        // delete images files
        $res = $mysqli->query('SELECT file_path FROM fleet_vehicle_images WHERE vehicle_id = '.intval($id));
        while ($r = $res->fetch_assoc()) {
            $path = __DIR__ . '/..' . $r['file_path'];
            if (is_file($path)) @unlink($path);
        }
        $stmt = $mysqli->prepare('DELETE FROM fleet_vehicle_images WHERE vehicle_id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $stmt->close();
        $stmt = $mysqli->prepare('DELETE FROM fleet_vehicles WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $stmt->close();
    } else {
        $stmt = $mysqli->prepare('UPDATE fleet_vehicles SET deleted_at = NOW() WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $stmt->close();
    }
        echo json_encode(['success'=>true]);
        exit;
    }
}

// Image upload endpoint (separate action)
    if ($method === 'POST' && isset($_POST['action']) && $_POST['action'] === 'upload_image') {
    requireAdmin();
    $vehicleId = intval($_POST['vehicle_id'] ?? 0);
    // allow vehicle_id = 0 for global media
    if (empty($_FILES['images'])) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'No files']); exit; }
    $files = $_FILES['images'];
    $added = [];
    // check if there's already a primary image for this vehicle
    $hasPrimaryRes = $mysqli->query('SELECT COUNT(*) AS c FROM fleet_vehicle_images WHERE vehicle_id = '.intval($vehicleId).' AND is_primary = 1');
    $hasPrimaryRow = $hasPrimaryRes ? $hasPrimaryRes->fetch_assoc() : null;
    $hasPrimary = $hasPrimaryRow ? intval($hasPrimaryRow['c']) > 0 : false;
    for ($i = 0; $i < count($files['name']); $i++) {
        $file = ['name'=>$files['name'][$i],'tmp_name'=>$files['tmp_name'][$i],'size'=>$files['size'][$i],'error'=>$files['error'][$i]];
        if ($file['error'] !== UPLOAD_ERR_OK) continue;
        if (!validateImage($file)) continue;
        // prevent duplicate original filenames
        $origBase = preg_replace('/[^A-Za-z0-9\-_.]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
        $like = $mysqli->real_escape_string($origBase) . '%';
        $dupRes = $mysqli->query("SELECT COUNT(*) AS c FROM fleet_vehicle_images WHERE file_name LIKE '" . $like . "'");
        $dupRow = $dupRes ? $dupRes->fetch_assoc() : null;
        if ($dupRow && intval($dupRow['c']) > 0) {
            http_response_code(400);
            echo json_encode(['success'=>false,'message'=>'An image with that name already exists: ' . $file['name']]);
            exit;
        }
        $saved = saveUploadedImage($file);
        if (!$saved) continue;
        // mark as primary if vehicle has no primary yet and this is the first uploaded file
        $isPrimary = (!$hasPrimary && $i === 0) ? 1 : 0;
        if ($isPrimary) {
            // ensure no other primary remains (safety)
            $stmtUnset = $mysqli->prepare('UPDATE fleet_vehicle_images SET is_primary = 0 WHERE vehicle_id = ?');
            $stmtUnset->bind_param('i', $vehicleId);
            $stmtUnset->execute();
            $stmtUnset->close();
        }
        $stmt = $mysqli->prepare('INSERT INTO fleet_vehicle_images (vehicle_id, file_name, file_path, is_primary, sort_order) VALUES (?, ?, ?, ?, 0)');
        $stmt->bind_param('issi', $vehicleId, $saved['file_name'], $saved['file_path'], $isPrimary);
        $stmt->execute();
        $id = $mysqli->insert_id;
        $stmt->close();
        $added[] = ['id'=>$id,'file_path'=>$saved['file_path']];
        if ($isPrimary) $hasPrimary = true;
    }

    // Replace existing image file for an image id
    if ($method === 'POST' && isset($_POST['action']) && $_POST['action'] === 'replace_image') {
        requireAdmin();
        $imageId = intval($_POST['image_id'] ?? 0);
        if ($imageId <= 0) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'image_id required']); exit; }
        if (empty($_FILES['images'])) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'No files']); exit; }
        // fetch existing image row
        $res = $mysqli->query('SELECT file_path FROM fleet_vehicle_images WHERE id = '.intval($imageId).' LIMIT 1');
        $row = $res->fetch_assoc();
        $oldPath = $row['file_path'] ?? null;
        $file = ['name'=>$_FILES['images']['name'][0] ?? $_FILES['images']['name'], 'tmp_name'=>is_array($_FILES['images']['tmp_name'])?$_FILES['images']['tmp_name'][0]:$_FILES['images']['tmp_name'], 'size'=>is_array($_FILES['images']['size'])?$_FILES['images']['size'][0]:$_FILES['images']['size'], 'error'=>is_array($_FILES['images']['error'])?$_FILES['images']['error'][0]:$_FILES['images']['error']];
        if ($file['error'] !== UPLOAD_ERR_OK) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Upload error']); exit; }
        if (!validateImage($file)) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid image']); exit; }
        $saved = saveUploadedImage($file);
        if (!$saved) { http_response_code(500); echo json_encode(['success'=>false,'message'=>'Unable to save file']); exit; }
        // update DB row
        $stmt = $mysqli->prepare('UPDATE fleet_vehicle_images SET file_name = ?, file_path = ? WHERE id = ?');
        $stmt->bind_param('ssi', $saved['file_name'], $saved['file_path'], $imageId);
        $stmt->execute();
        $stmt->close();
        // delete old file
        if ($oldPath) {
            $p = __DIR__ . '/..' . $oldPath;
            if (is_file($p)) @unlink($p);
        }
        echo json_encode(['success'=>true,'file_path'=>$saved['file_path']]);
        exit;
    }
    echo json_encode(['success'=>true,'added'=>$added]);
    exit;
}

// set primary image
if ($method === 'PUT' && isset($_GET['action']) && $_GET['action'] === 'set_primary') {
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $imageId = intval($data['image_id'] ?? 0);
    $vehicleId = intval($data['vehicle_id'] ?? 0);
    if ($imageId <= 0) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'A valid image is required']); exit; }

    $rowRes = $mysqli->query('SELECT * FROM fleet_vehicle_images WHERE id = '.intval($imageId).' LIMIT 1');
    $row = $rowRes ? $rowRes->fetch_assoc() : null;
    if (!$row) { http_response_code(404); echo json_encode(['success'=>false,'message'=>'Image not found']); exit; }
    if ($vehicleId <= 0) $vehicleId = intval($row['vehicle_id'] ?? 0);
    if ($vehicleId <= 0) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Select a vehicle for this global image']); exit; }

    $clearUsage = $mysqli->prepare("DELETE FROM fleet_image_usages WHERE location = 'vehicle' AND reference_id = ?");
    $clearUsage->bind_param('i', $vehicleId);
    $clearUsage->execute();
    $clearUsage->close();

    // ensure target vehicle has only one primary image
    $stmt = $mysqli->prepare('UPDATE fleet_vehicle_images SET is_primary = 0 WHERE vehicle_id = ?');
    $stmt->bind_param('i', $vehicleId);
    $stmt->execute();
    $stmt->close();

    $usageImageId = $imageId;
    if (intval($row['vehicle_id']) === $vehicleId) {
        $stmt = $mysqli->prepare('UPDATE fleet_vehicle_images SET is_primary = 1 WHERE id = ? AND vehicle_id = ?');
        $stmt->bind_param('ii', $imageId, $vehicleId);
        $stmt->execute();
        $stmt->close();
    } else {
        // if the selected image belongs to another vehicle or is global, attach a copy for this vehicle
        $escapedPath = $mysqli->real_escape_string($row['file_path']);
        $existingRes = $mysqli->query("SELECT id FROM fleet_vehicle_images WHERE vehicle_id = " . intval($vehicleId) . " AND file_path = '" . $escapedPath . "' LIMIT 1");
        $existing = $existingRes ? $existingRes->fetch_assoc() : null;
        if ($existing) {
            $stmt = $mysqli->prepare('UPDATE fleet_vehicle_images SET is_primary = 1 WHERE id = ? AND vehicle_id = ?');
            $stmt->bind_param('ii', $existing['id'], $vehicleId);
            $stmt->execute();
            $stmt->close();
        } else {
            $stmt = $mysqli->prepare('INSERT INTO fleet_vehicle_images (vehicle_id, file_name, file_path, is_primary, sort_order) VALUES (?, ?, ?, 1, 0)');
            $stmt->bind_param('iss', $vehicleId, $row['file_name'], $row['file_path']);
            $stmt->execute();
            $usageImageId = $mysqli->insert_id;
            $stmt->close();
        }
    }
    $usage = $mysqli->prepare("INSERT IGNORE INTO fleet_image_usages (image_id, location, reference_id) VALUES (?, 'vehicle', ?)");
    $usage->bind_param('ii', $usageImageId, $vehicleId);
    $usage->execute();
    $usage->close();
    echo json_encode(['success'=>true]);
    exit;
}

// update image metadata
if ($method === 'PUT' && isset($_GET['action']) && $_GET['action'] === 'update_image') {
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $imageId = intval($data['image_id'] ?? 0);
    if ($imageId <= 0) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid image id']); exit; }
    $fields = [];
    $values = [];
    if (array_key_exists('file_name', $data)) { $fields[] = 'file_name = ?'; $values[] = $data['file_name']; }
    // upsert meta
    $metaTitle = array_key_exists('meta_title', $data) ? $data['meta_title'] : null;
    $metaDesc = array_key_exists('meta_description', $data) ? $data['meta_description'] : null;
    $alt = array_key_exists('alt_text', $data) ? $data['alt_text'] : null;
    if ($fields) {
        $sql = 'UPDATE fleet_vehicle_images SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $values[] = $imageId;
        $types = str_repeat('s', count($values)-1) . 'i';
        $stmt = $mysqli->prepare($sql);
        $stmt->bind_param($types, ...$values);
        $stmt->execute();
        $stmt->close();
    }
    // upsert meta table
    $stmt = $mysqli->prepare('REPLACE INTO fleet_vehicle_image_meta (image_id, meta_title, meta_description, alt_text) VALUES (?, ?, ?, ?)');
    $stmt->bind_param('isss', $imageId, $metaTitle, $metaDesc, $alt);
    $stmt->execute();
    $stmt->close();
    echo json_encode(['success'=>true]);
    exit;
}

// delete image
if ($method === 'DELETE' && isset($_GET['image_id'])) {
    requireAdmin();
    $imageId = intval($_GET['image_id']);
    if ($imageId <= 0) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid image id']); exit; }
    $res = $mysqli->query('SELECT file_path, is_primary, vehicle_id FROM fleet_vehicle_images WHERE id = '.intval($imageId).' LIMIT 1');
    $row = $res->fetch_assoc();
    $wasPrimary = 0;
    $vehicleIdForImage = 0;
    if ($row) {
        $path = __DIR__ . '/..' . $row['file_path'];
        if (is_file($path)) @unlink($path);
        $wasPrimary = intval($row['is_primary'] ?? 0);
        $vehicleIdForImage = intval($row['vehicle_id'] ?? 0);
    }
    $stmt = $mysqli->prepare('DELETE FROM fleet_vehicle_images WHERE id = ?');
    $stmt->bind_param('i', $imageId);
    $stmt->execute();
    $stmt->close();
    $usageDelete = $mysqli->prepare('DELETE FROM fleet_image_usages WHERE image_id = ?');
    $usageDelete->bind_param('i', $imageId);
    $usageDelete->execute();
    $usageDelete->close();

    // if the deleted image was primary, promote another image (if any) to primary
    if ($wasPrimary && $vehicleIdForImage > 0) {
        $r2 = $mysqli->query('SELECT id FROM fleet_vehicle_images WHERE vehicle_id = '.intval($vehicleIdForImage).' ORDER BY sort_order ASC, id ASC LIMIT 1');
        if ($r2 && ($n = $r2->fetch_assoc())) {
            $newId = intval($n['id']);
            $stmt2 = $mysqli->prepare('UPDATE fleet_vehicle_images SET is_primary = 1 WHERE id = ? AND vehicle_id = ?');
            $stmt2->bind_param('ii', $newId, $vehicleIdForImage);
            $stmt2->execute();
            $stmt2->close();
        }
    }

    echo json_encode(['success'=>true]);
    exit;
}

// most-booked
if ($method === 'GET' && isset($_GET['most_booked'])) {
    requireAdmin();
    $res = $mysqli->query('SELECT v.id, v.name, COUNT(b.id) AS bookings FROM fleet_vehicles v LEFT JOIN bookings b ON b.vehicle_id = v.id GROUP BY v.id ORDER BY bookings DESC LIMIT 10');
    $out = [];
    while ($r = $res->fetch_assoc()) $out[] = $r;
    echo json_encode(['success'=>true,'most_booked'=>$out]);
    exit;
}

http_response_code(405);
echo json_encode(['success'=>false,'message'=>'Method not allowed']);

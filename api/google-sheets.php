<?php

$googleSheetsConfig = __DIR__ . '/google-sheets-config.php';
if (is_readable($googleSheetsConfig)) {
    require_once $googleSheetsConfig;
}

function syncBookingToGoogleSheets(array $booking): bool {
    $webhookUrl = trim((string) (defined('ABBEY_GOOGLE_SHEETS_WEBHOOK_URL') ? ABBEY_GOOGLE_SHEETS_WEBHOOK_URL : getenv('ABBEY_GOOGLE_SHEETS_WEBHOOK_URL')));
    $token = trim((string) (defined('ABBEY_GOOGLE_SHEETS_TOKEN') ? ABBEY_GOOGLE_SHEETS_TOKEN : getenv('ABBEY_GOOGLE_SHEETS_TOKEN')));

    if ($webhookUrl === '') {
        return true;
    }

    if (!function_exists('curl_init')) {
        error_log('Google Sheets sync skipped: PHP cURL is not enabled.');
        return false;
    }

    $payload = json_encode([
        'token' => $token,
        'booking' => $booking,
    ]);

    if ($payload === false) {
        error_log('Google Sheets sync skipped: unable to encode booking payload.');
        return false;
    }

    $curl = curl_init($webhookUrl);
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 3,
        CURLOPT_TIMEOUT => 8,
        CURLOPT_FOLLOWLOCATION => false,
    ]);

    $response = curl_exec($curl);
    $curlError = curl_error($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    if ($response === false || $status < 200 || $status >= 300) {
        error_log('Google Sheets sync failed for booking ' . ($booking['id'] ?? 'unknown') . ': ' . ($curlError ?: 'HTTP ' . $status));
        return false;
    }

    return true;
}

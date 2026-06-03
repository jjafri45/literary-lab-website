<?php
declare(strict_types=1);

session_start([
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
    'cookie_secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
]);

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Method not allowed.']);
    exit;
}

$raw = file_get_contents('php://input');
$payload = json_decode($raw ?: '{}', true);
$passcode = trim((string) ($payload['passcode'] ?? ''));

if ($passcode === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Passcode is required.']);
    exit;
}

$configPath = __DIR__ . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR . 'site-content.json';
$configRaw = @file_get_contents($configPath);
$config = json_decode($configRaw ?: '{}', true);
$expectedHash = (string) ($config['adminSecurity']['passcodeHash'] ?? '');
$sessionMinutes = max(5, (int) ($config['adminSecurity']['sessionMinutes'] ?? 30));

if ($expectedHash === '') {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Admin security is not configured.']);
    exit;
}

$candidateHash = hash('sha256', $passcode);
if (!hash_equals($expectedHash, $candidateHash)) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'message' => 'Incorrect passcode.']);
    exit;
}

$_SESSION['literary_lab_admin'] = [
    'authenticated' => true,
    'expires_at' => time() + ($sessionMinutes * 60),
];

echo json_encode([
    'ok' => true,
    'message' => 'Authenticated.',
    'expiresAt' => $_SESSION['literary_lab_admin']['expires_at'],
]);

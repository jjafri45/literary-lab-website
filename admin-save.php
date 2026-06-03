<?php
declare(strict_types=1);

session_start([
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
    'cookie_secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
]);

header('Content-Type: application/json; charset=UTF-8');

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > 0 && empty($_POST) && empty($_FILES)) {
    fail(413, 'Payload too large for the current server limits. Please wait a minute and try Save Live Changes again.');
}

function fail(int $status, string $message): void
{
    http_response_code($status);
    echo json_encode(['ok' => false, 'message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fail(405, 'Method not allowed.');
}

$session = $_SESSION['literary_lab_admin'] ?? null;
if (!is_array($session) || empty($session['authenticated']) || (int) ($session['expires_at'] ?? 0) < time()) {
    fail(401, 'Admin session expired. Please log in again.');
}

$contentRaw = $_POST['content'] ?? '';
$assetsRaw = $_POST['assets'] ?? '[]';

$content = json_decode((string) $contentRaw, true);
$assets = json_decode((string) $assetsRaw, true);

if (!is_array($content)) {
    fail(422, 'Invalid content payload.');
}

if (!is_array($assets)) {
    fail(422, 'Invalid asset payload.');
}

$root = __DIR__;
$allowedPrefix = 'images/cms/';

foreach ($assets as $index => $asset) {
    if (!is_array($asset)) {
        fail(422, 'Invalid asset entry.');
    }

    $field = (string) ($asset['field'] ?? '');
    $targetPath = str_replace('\\', '/', (string) ($asset['targetPath'] ?? ''));

    if ($field === '' || $targetPath === '') {
        fail(422, 'Asset metadata is incomplete.');
    }

    if (!str_starts_with($targetPath, $allowedPrefix)) {
        fail(422, 'Asset path is not allowed.');
    }

    if (!isset($_FILES[$field])) {
        fail(422, 'Uploaded file missing.');
    }

    $uploadError = (int) ($_FILES[$field]['error'] ?? UPLOAD_ERR_OK);
    if ($uploadError !== UPLOAD_ERR_OK) {
        $uploadMessages = [
            UPLOAD_ERR_INI_SIZE => 'One or more uploaded images exceeded the server upload limit.',
            UPLOAD_ERR_FORM_SIZE => 'One or more uploaded images exceeded the form upload limit.',
            UPLOAD_ERR_PARTIAL => 'One or more uploaded images uploaded only partially.',
            UPLOAD_ERR_NO_FILE => 'One or more uploaded images were missing.',
            UPLOAD_ERR_NO_TMP_DIR => 'Server upload temp directory is missing.',
            UPLOAD_ERR_CANT_WRITE => 'Server could not write one or more uploaded images.',
            UPLOAD_ERR_EXTENSION => 'A server extension stopped one or more image uploads.',
        ];
        fail(422, $uploadMessages[$uploadError] ?? 'An uploaded image failed before it could be saved.');
    }

    if (!is_uploaded_file($_FILES[$field]['tmp_name'])) {
        fail(422, 'Uploaded file missing.');
    }

    $tmpPath = $_FILES[$field]['tmp_name'];
    $mime = mime_content_type($tmpPath) ?: '';
    $allowedMimes = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'image/gif' => 'gif',
        'image/svg+xml' => 'svg',
    ];

    if (!isset($allowedMimes[$mime])) {
        fail(422, 'Unsupported image type.');
    }

    $fullPath = $root . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $targetPath);
    $dir = dirname($fullPath);
    if (!is_dir($dir) && !mkdir($dir, 0775, true) && !is_dir($dir)) {
        fail(500, 'Unable to create image directory.');
    }

    if (!move_uploaded_file($tmpPath, $fullPath)) {
        fail(500, 'Unable to save uploaded image.');
    }
}

$contentPath = $root . DIRECTORY_SEPARATOR . 'data' . DIRECTORY_SEPARATOR . 'site-content.json';
$encoded = json_encode($content, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
if ($encoded === false) {
    fail(500, 'Unable to encode content JSON.');
}

if (file_put_contents($contentPath, $encoded . PHP_EOL, LOCK_EX) === false) {
    fail(500, 'Unable to save content file.');
}

$_SESSION['literary_lab_admin']['expires_at'] = time() + (max(5, (int) ($content['adminSecurity']['sessionMinutes'] ?? 30)) * 60);

echo json_encode([
    'ok' => true,
    'message' => 'Content saved.',
    'data' => $content,
]);

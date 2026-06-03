<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Method not allowed.']);
    exit;
}

function clean_text(string $value): string
{
    $value = trim($value);
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    return preg_replace("/[ \t]+/", ' ', $value) ?? '';
}

function field(string $key): string
{
    return isset($_POST[$key]) ? clean_text((string) $_POST[$key]) : '';
}

$honeypot = field('company');
if ($honeypot !== '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'message' => 'Invalid submission.']);
    exit;
}

$payload = [
    'submitted_at' => gmdate('c'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
    'name' => field('name'),
    'email' => field('email'),
    'whatsapp' => field('whatsapp'),
    'service' => field('service'),
    'project_stage' => field('project_stage'),
    'formats_needed' => field('formats_needed'),
    'genre' => field('genre'),
    'wordcount' => field('wordcount'),
    'budget_range' => field('budget_range'),
    'deadline' => field('deadline'),
    'message' => field('message'),
];

if ($payload['name'] === '' || $payload['email'] === '' || $payload['service'] === '' || $payload['project_stage'] === '' || $payload['formats_needed'] === '' || $payload['message'] === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Please complete all required fields.']);
    exit;
}

if (!filter_var($payload['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

$storageDir = __DIR__ . DIRECTORY_SEPARATOR . 'storage';
if (!is_dir($storageDir)) {
    mkdir($storageDir, 0775, true);
}

$logPath = $storageDir . DIRECTORY_SEPARATOR . 'contact-submissions.ndjson';
$jsonLine = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
if ($jsonLine === false || file_put_contents($logPath, $jsonLine . PHP_EOL, FILE_APPEND | LOCK_EX) === false) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'message' => 'Unable to save submission.']);
    exit;
}

$subject = 'New Book Design Inquiry - Literary Lab';
$to = 'hello@literarylabstudio.com,studio@literarylabstudio.com';
$body = "New website inquiry\n\n";
$body .= "Name: {$payload['name']}\n";
$body .= "Email: {$payload['email']}\n";
$body .= "WhatsApp: {$payload['whatsapp']}\n";
$body .= "Service: {$payload['service']}\n";
$body .= "Project Stage: {$payload['project_stage']}\n";
$body .= "Formats Needed: {$payload['formats_needed']}\n";
$body .= "Genre: {$payload['genre']}\n";
$body .= "Word Count: {$payload['wordcount']}\n";
$body .= "Budget Range: {$payload['budget_range']}\n";
$body .= "Deadline: {$payload['deadline']}\n";
$body .= "Submitted At (UTC): {$payload['submitted_at']}\n";
$body .= "IP: {$payload['ip']}\n\n";
$body .= "Message:\n{$payload['message']}\n";

$headers = [
    'From: Literary Lab Website <noreply@literarylabstudio.com>',
    'Reply-To: ' . $payload['email'],
    'Content-Type: text/plain; charset=UTF-8',
];

$mailSent = @mail($to, $subject, $body, implode("\r\n", $headers));

echo json_encode([
    'ok' => true,
    'message' => 'Submission received.',
    'mailSent' => $mailSent,
]);

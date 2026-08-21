<?php
// ============================================================================
//  BULLETPROOF ERROR CATCHER — catches EVERYTHING, always returns JSON.
// ============================================================================
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/mail-error.log');
error_reporting(E_ALL);

// Catch fatal errors (parse errors, out-of-memory, undefined functions, etc.)
register_shutdown_function(function () {
    $e = error_get_last();
    if ($e && in_array($e['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        if (!headers_sent()) {
            header('Content-Type: application/json');
            http_response_code(500);
        }
        echo json_encode([
            'success' => false,
            'message' => 'PHP fatal error',
            'detail'  => $e['message'] . ' in ' . basename($e['file']) . ':' . $e['line'],
        ]);
    }
});

set_exception_handler(function ($e) {
    if (!headers_sent()) {
        header('Content-Type: application/json');
        http_response_code(500);
    }
    echo json_encode([
        'success' => false,
        'message' => 'PHP exception',
        'detail'  => $e->getMessage(),
    ]);
    exit;
});

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
header("Content-Security-Policy: default-src 'none'; frame-ancestors 'self'; base-uri 'none'");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// ── CONFIG ──────────────────────────────────────────────────────────────────
$MAIL_TO   = 'arun.p@destinynumbers.in, arunart@gmail.com';
$MAIL_FROM = 'noreply@destinynumbers.in'; // MUST be an address on this domain
// ────────────────────────────────────────────────────────────────────────────

// Debug: https://www.destinynumbers.in/send-mail.php?debug=1
if (isset($_GET['debug'])) {
    echo json_encode([
        'php_version'     => PHP_VERSION,
        'mail_available'  => function_exists('mail'),
        'openssl_loaded'  => extension_loaded('openssl'),
        'sendmail_path'   => ini_get('sendmail_path'),
        'writable_dir'    => is_writable(__DIR__),
        'error_log_size'  => file_exists(__DIR__ . '/mail-error.log') ? filesize(__DIR__ . '/mail-error.log') : 0,
    ], JSON_PRETTY_PRINT);
    exit;
}

// View last errors: https://www.destinynumbers.in/send-mail.php?viewlog=1
if (isset($_GET['viewlog'])) {
    header('Content-Type: text/plain');
    $log = __DIR__ . '/mail-error.log';
    echo file_exists($log) ? file_get_contents($log) : 'No errors logged yet.';
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON body', 'raw' => substr($raw, 0, 200)]);
    exit;
}

$name    = trim(isset($data['name'])    ? $data['name']    : '');
$email   = trim(isset($data['email'])   ? $data['email']   : '');
$service = trim(isset($data['service']) ? $data['service'] : 'General');
$message = trim(isset($data['message']) ? $data['message'] : '');

if (!$name || !$email || !$message || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid or missing fields']);
    exit;
}

$safeName    = htmlspecialchars($name,    ENT_QUOTES, 'UTF-8');
$safeEmail   = htmlspecialchars($email,   ENT_QUOTES, 'UTF-8');
$safeService = htmlspecialchars($service, ENT_QUOTES, 'UTF-8');
$safeMessage = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));

$subject = 'New Inquiry - ' . $safeService;

$body  = '<div style="font-family:sans-serif;max-width:600px;color:#1C3557">';
$body .= '<h2 style="color:#0D1B3E;border-bottom:2px solid #C9A84C;padding-bottom:8px">New Contact Form Submission</h2>';
$body .= '<table cellpadding="8" style="border-collapse:collapse;width:100%">';
$body .= '<tr><td style="color:#C9A84C;font-weight:bold;width:100px">Name</td><td>' . $safeName . '</td></tr>';
$body .= '<tr style="background:#f9f6f0"><td style="color:#C9A84C;font-weight:bold">Email</td><td>' . $safeEmail . '</td></tr>';
$body .= '<tr><td style="color:#C9A84C;font-weight:bold">Service</td><td>' . $safeService . '</td></tr>';
$body .= '<tr style="background:#f9f6f0"><td style="color:#C9A84C;font-weight:bold;vertical-align:top">Message</td><td>' . $safeMessage . '</td></tr>';
$body .= '</table></div>';

$headers  = 'From: Destiny Numbers <' . $MAIL_FROM . ">\r\n";
$headers .= 'Reply-To: ' . $name . ' <' . $email . ">\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= 'X-Mailer: PHP/' . phpversion() . "\r\n";

$sent = @mail($MAIL_TO, $subject, $body, $headers, '-f' . $MAIL_FROM);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
} else {
    $err = error_get_last();
    error_log('mail() failed: ' . ($err ? $err['message'] : 'unknown'));
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'mail() function returned false',
        'detail'  => $err ? $err['message'] : 'no error details',
    ]);
}

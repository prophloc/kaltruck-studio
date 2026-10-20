<?php
declare(strict_types=1);

/**
 * KALTRUCK contact form for cPanel/PHP hosting.
 * Do not embed credentials or secret SMTP passwords in public_html.
 * mail() queues via the host's configured mail transport, not Gmail directly.
 */
$ajax = strtolower($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'xmlhttprequest';

function finish_request(int $status, string $message, bool $ajax): void {
    if ($ajax) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        header('X-Content-Type-Options: nosniff');
        echo json_encode(['success' => $status === 200, 'message' => $message], JSON_UNESCAPED_UNICODE);
    } else {
        header('Location: /kontakt/?status=' . ($status === 200 ? 'sent' : 'error'), true, 303);
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    finish_request(405, 'Ta metoda nie jest obsługiwana.', $ajax);
}

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 12000) {
    finish_request(413, 'Wiadomość jest zbyt długa.', $ajax);
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_REFERER'] ?? '');
if ($origin !== '') {
    $host = parse_url($origin, PHP_URL_HOST);
    if (!in_array(strtolower((string) $host), ['transportplockhds.pl', 'www.transportplockhds.pl'], true)) {
        finish_request(403, 'Niedozwolone źródło formularza.', $ajax);
    }
}

if (!empty($_POST['website'])) {
    // Honeypot: do not confirm to automated senders that their mail was rejected.
    finish_request(200, 'Zapytanie zostało przyjęte.', $ajax);
}

$fields = ['person', 'phone', 'email', 'service', 'details'];
foreach ($fields as $field) {
    if (!isset($_POST[$field]) || !is_string($_POST[$field])) {
        finish_request(422, 'Uzupełnij wymagane pola formularza.', $ajax);
    }
}

$person = trim(strip_tags($_POST['person']));
$phone = trim(strip_tags($_POST['phone']));
$email = trim($_POST['email']);
$service = trim($_POST['service']);
$details = trim(strip_tags(str_replace(["\r\n", "\r"], "\n", $_POST['details'])));

$allowedServices = [
    'Transport HDS', 'Transport kontenerów', 'Transport maszyn',
    'Transport prefabrykatów', 'Rozładunek HDS', 'Wynajem HDS', 'Inne',
];

if ($person === '' || $details === '' || ($phone === '' && $email === '')
    || strlen($person) > 240 || strlen($phone) > 100
    || strlen($email) > 254 || strlen($details) > 8000
    || !in_array($service, $allowedServices, true)
    || ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL))
    || preg_match('/[\r\n]/', $person . $phone . $email) === 1) {
    finish_request(422, 'Sprawdź wpisane dane oraz telefon lub adres e-mail.', $ajax);
}

// Per-IP rate limit: no more than three messages in 15 minutes and a 45-second gap.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR)
    . DIRECTORY_SEPARATOR . 'kaltruck_form_' . hash('sha256', __DIR__ . ':' . $ip) . '.txt';
$handle = @fopen($rateFile, 'c+');
if ($handle === false) {
    error_log('[KALTRUCK FORM] Cannot open rate-limit store');
    finish_request(503, 'Wysyłanie jest chwilowo niedostępne. Spróbuj później.', $ajax);
}
if (!flock($handle, LOCK_EX)) {
    fclose($handle);
    finish_request(503, 'Wysyłanie jest chwilowo niedostępne. Spróbuj później.', $ajax);
}
$now = time();
$history = array_filter(
    array_map('intval', explode(',', (string) stream_get_contents($handle))),
    static fn (int $stamp): bool => $stamp > $now - 900 && $stamp <= $now
);
if (count($history) >= 3 || ($history !== [] && max($history) > $now - 45)) {
    flock($handle, LOCK_UN);
    fclose($handle);
    finish_request(429, 'Zbyt wiele prób. Spróbuj ponownie za minutę.', $ajax);
}

$body = implode("\n", [
    'Zapytanie z formularza transportplockhds.pl',
    '',
    'Imię / firma: ' . $person,
    'Telefon: ' . ($phone ?: 'nie podano'),
    'E-mail: ' . ($email ?: 'nie podano'),
    'Usługa: ' . $service,
    '',
    'Opis ładunku i trasy:',
    $details,
    '',
    '---',
    'Wiadomość wysłano z formularza kontaktowego KALTRUCK.',
]);

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: KALTRUCK Formularz <formularz@transportplockhds.pl>',
    'X-Mailer: KALTRUCK website',
];
if ($email !== '') {
    $headers[] = 'Reply-To: ' . $email;
}

$sent = @mail(
    'hds.plock@gmail.com',
    'Zapytanie z formularza KALTRUCK',
    $body,
    implode("\r\n", $headers)
);
if ($sent) {
    $history[] = $now;
    rewind($handle);
    ftruncate($handle, 0);
    fwrite($handle, implode(',', $history));
    fflush($handle);
}
flock($handle, LOCK_UN);
fclose($handle);

if (!$sent) {
    error_log('[KALTRUCK FORM] PHP mail() rejected outgoing message');
    finish_request(503, 'Nie udało się wysłać wiadomości. Napisz na hds.plock@gmail.com lub zadzwoń.', $ajax);
}
finish_request(200, 'Zapytanie zostało przyjęte do wysyłki.', $ajax);

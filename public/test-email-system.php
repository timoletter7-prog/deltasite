<?php
// Test script for the email system
header('Content-Type: application/json');

// Test data for email
$testData = [
    'to_email' => 'test@example.com', // Replace with your test email
    'to_name' => 'Test User',
    'customer_name' => 'Test Customer',
    'order_number' => 'TEST-' . date('Ymd-His'),
    'products' => "VIP Rank (x1) - €5.00\nDiamond Pack (x2) - €10.00",
    'total_price' => '15.00',
    'payment_method' => 'iDEAL'
];

// Test both email endpoints
$endpoints = [
    'php-mail' => 'http://localhost:8081/send-order-email.php',
    'smtp-mail' => 'http://localhost:8081/send-order-email-smtp.php'
];

$results = [];

foreach ($endpoints as $name => $url) {
    // Make a POST request to the email endpoint
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($testData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    $results[$name] = [
        'endpoint' => $url,
        'http_code' => $httpCode,
        'response' => json_decode($response, true),
        'error' => $error ?: null,
        'success' => $httpCode === 200 && isset(json_decode($response, true)['success']) && json_decode($response, true)['success']
    ];
}

// Return comprehensive test results
echo json_encode([
    'test_timestamp' => date('Y-m-d H:i:s'),
    'test_data' => $testData,
    'results' => $results,
    'summary' => [
        'php_mail_success' => $results['php-mail']['success'] ?? false,
        'smtp_mail_success' => $results['smtp-mail']['success'] ?? false,
        'both_working' => ($results['php-mail']['success'] ?? false) && ($results['smtp-mail']['success'] ?? false)
    ],
    'instructions' => [
        'php_mail' => 'Uses PHP mail() function - configure sendmail/postfix on server',
        'smtp_mail' => 'Uses PHPMailer with SMTP - configure credentials in send-order-email-smtp.php',
        'testing' => 'Replace test@example.com with real email to test delivery'
    ]
], JSON_PRETTY_PRINT);
?>

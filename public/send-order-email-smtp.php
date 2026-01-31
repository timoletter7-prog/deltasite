<?php
// Enable CORS for frontend requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Include PHPMailer
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Rate limiting - prevent email spam
session_start();
$rate_limit_key = 'email_rate_limit_' . $_SERVER['REMOTE_ADDR'];
$current_time = time();

// Check rate limit (max 5 emails per hour per IP)
if (isset($_SESSION[$rate_limit_key])) {
    $requests = $_SESSION[$rate_limit_key];
    $requests = array_filter($requests, function($timestamp) {
        return (time() - $timestamp) < 3600; // 1 hour window
    });

    if (count($requests) >= 5) {
        http_response_code(429);
        echo json_encode(['error' => 'Te veel email verzoeken. Probeer het later opnieuw.']);
        exit;
    }

    $requests[] = $current_time;
    $_SESSION[$rate_limit_key] = $requests;
} else {
    $_SESSION[$rate_limit_key] = [$current_time];
}

// Get JSON data from request
$json = file_get_contents('php://input');
$data = json_decode($json, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

// Validate required fields
$required_fields = ['to_email', 'to_name', 'customer_name', 'order_number', 'products', 'total_price', 'payment_method'];
foreach ($required_fields as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

// Extract data
$to_email = filter_var($data['to_email'], FILTER_VALIDATE_EMAIL);
$to_name = htmlspecialchars($data['to_name']);
$customer_name = htmlspecialchars($data['customer_name']);
$order_number = htmlspecialchars($data['order_number']);
$products = htmlspecialchars($data['products']);
$total_price = htmlspecialchars($data['total_price']);
$payment_method = htmlspecialchars($data['payment_method']);

if (!$to_email) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

// HTML Email Template
$html_template = '<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bestelling Bevestiging</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background-color: #667eea;
      color: #fff;
      text-align: center;
      padding: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
    }
    .order-details {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }
    .order-details h3 {
      margin-top: 0;
    }
    .total {
      font-weight: bold;
      color: #28a745;
    }
    .footer {
      background-color: #343a40;
      color: #fff;
      text-align: center;
      padding: 15px;
    }
    a {
      color: #007bff;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎮 Bedankt voor je bestelling, {{customer_name}}!</h1>
    </div>

    <div class="content">
      <p>Hallo {{customer_name}},</p>
      <p>Je bestelling is succesvol geplaatst. Hieronder vind je de details:</p>

      <div class="order-details">
        <h3>Ordernummer: #{{order_number}}</h3>
        <h4>Producten:</h4>
        <pre>{{products}}</pre>
        <p class="total">Totaal: €{{total_price}}</p>
        <p><strong>Betaalmethode:</strong> {{payment_method}}</p>
      </div>

      <p>Je items worden binnen enkele minuten toegevoegd aan je account.</p>
      <p>Voor vragen kun je contact opnemen via: <a href="mailto:{{to_email}}">{{to_email}}</a></p>
    </div>

    <div class="footer">
      <p>Groet,<br><strong>DeltaMC Team</strong></p>
      <p>Website: <a href="https://deltamc.nl">deltamc.nl</a></p>
    </div>
  </div>
</body>
</html>';

// Replace placeholders in HTML template
$message = str_replace('{{customer_name}}', $customer_name, $html_template);
$message = str_replace('{{order_number}}', $order_number, $message);
$message = str_replace('{{products}}', $products, $message);
$message = str_replace('{{total_price}}', $total_price, $message);
$message = str_replace('{{payment_method}}', $payment_method, $message);
$message = str_replace('{{to_email}}', $to_email, $message);

// Email configuration
$subject = "🎮 Je bestelling is succesvol geplaatst!";

// Create PHPMailer instance
$mail = new PHPMailer(true);

try {
    // Server settings - CONFIGURE THESE FOR YOUR SMTP SERVICE
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com'; // Replace with your SMTP host (e.g., smtp.sendgrid.com)
    $mail->SMTPAuth   = true;
    $mail->Username   = 'your-email@gmail.com'; // Replace with your SMTP username
    $mail->Password   = 'your-app-password'; // Replace with your SMTP password/app key
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    // Recipients
    $mail->setFrom('info@mydigibalance.nl', 'DeltaMC');
    $mail->addAddress($to_email, $to_name);

    // Content
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = $message;
    $mail->AltBody = strip_tags(str_replace(['<br>', '</p>'], ["\n", "\n\n"], $message));

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Email sent successfully via SMTP']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => "Email could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
}
?>

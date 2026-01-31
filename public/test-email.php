<?php
// Test script voor je email configuratie
header('Content-Type: text/plain');

// Test 1: Basis mail() functie
echo "=== TEST 1: PHP mail() functie ===\n";
echo "⚠️  LET OP: Op lokale PC werkt PHP mail() meestal niet!\n";
echo "Dit is normaal - gebruik PHPMailer voor productie.\n\n";

$test_email = 'info@mydigibalance.nl'; // ← Vervang met je eigen email
$subject = 'DeltaMC Email Test';
$message = 'Dit is een test van de PHP mail() functie.';
$headers = 'From: test@mydigibalance.nl';

if(mail($test_email, $subject, $message, $headers)) {
    echo "✅ PHP mail() werkt!\n";
} else {
    echo "❌ PHP mail() werkt niet (normaal op lokale PC)\n";
}

// Test 2: SMTP verbinding (vereist PHPMailer)
echo "\n=== TEST 2: SMTP Verbinding ===\n";

if (file_exists('PHPMailer/src/PHPMailer.php')) {
    require 'PHPMailer/src/PHPMailer.php';
    require 'PHPMailer/src/SMTP.php';
    require 'PHPMailer/src/Exception.php';

    $mail = new PHPMailer\PHPMailer\PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = 'mail.mydigibalance.nl'; // ← Je SMTP server
        $mail->SMTPAuth   = true;
        $mail->Username   = 'info@mydigibalance.nl'; // ← Je email
        $mail->Password   = 'jouw-email-wachtwoord'; // ← Je wachtwoord
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // Test verbinding zonder email te sturen
        $mail->smtpConnect();
        echo "✅ SMTP verbinding succesvol!\n";
        $mail->smtpClose();

    } catch (Exception $e) {
        echo "❌ SMTP verbinding mislukt: " . $mail->ErrorInfo . "\n";
    }
} else {
    echo "❌ PHPMailer niet gevonden. Download eerst PHPMailer.\n";
}

// Test 3: Server informatie
echo "\n=== TEST 3: Server Informatie ===\n";
echo "PHP Version: " . phpversion() . "\n";
echo "Server: " . $_SERVER['SERVER_SOFTWARE'] . "\n";
echo "SMTP: " . ini_get('SMTP') . "\n";
echo "sendmail_path: " . ini_get('sendmail_path') . "\n";
?>

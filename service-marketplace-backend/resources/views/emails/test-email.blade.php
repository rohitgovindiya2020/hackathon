<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SMTP Test Email</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .email-header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .email-body {
            padding: 40px 30px;
        }
        .success-icon {
            text-align: center;
            font-size: 64px;
            margin-bottom: 20px;
        }
        .email-body h2 {
            color: #2d3748;
            font-size: 24px;
            margin-bottom: 15px;
            text-align: center;
        }
        .email-body p {
            color: #4a5568;
            font-size: 16px;
            margin-bottom: 20px;
            text-align: center;
        }
        .info-box {
            background: #f7fafc;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
        }
        .info-box p {
            margin: 0;
            text-align: left;
            font-size: 14px;
        }
        .info-box strong {
            color: #2d3748;
        }
        .email-footer {
            background: #f7fafc;
            padding: 25px 30px;
            text-align: center;
            font-size: 14px;
            color: #718096;
        }
        .email-footer p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>✉️ SMTP Test Email</h1>
        </div>
        
        <div class="email-body">
            <div class="success-icon">✅</div>
            
            <h2>Congratulations!</h2>
            
            <p>Your SMTP configuration is working correctly. This is a test email sent from your Service Marketplace platform.</p>
            
            <div class="info-box">
                <p><strong>Test Details:</strong></p>
                <p>• Email sent successfully</p>
                <p>• SMTP connection established</p>
                <p>• Email delivery confirmed</p>
                <p>• Timestamp: {{ date('F j, Y, g:i a') }}</p>
            </div>
            
            <p>You can now use this email configuration to send notifications to your users.</p>
        </div>
        
        <div class="email-footer">
            <p><strong>Service Marketplace</strong></p>
            <p>This is an automated test email. Please do not reply to this message.</p>
        </div>
    </div>
</body>
</html>

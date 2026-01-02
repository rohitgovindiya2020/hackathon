<!DOCTYPE html>
<html>
<head>
    <title>Booking Approved</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .header { background-color: #10b981; color: white; padding: 15px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { padding: 20px; }
        .info-box { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #10b981; margin: 20px 0; }
        .footer { font-size: 12px; color: #777; text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>🎉 Booking Approved!</h2>
        </div>
        <div class="content">
            <p>Hello {{ $interest->customer->name }},</p>
            <p>Great news! Your booking for <strong>{{ $interest->discount->service->name }}</strong> has been approved by the service provider.</p>
            
            <div class="info-box">
                <p><strong>Service:</strong> {{ $interest->discount->service->name }}</p>
                <p><strong>Date:</strong> {{ \Carbon\Carbon::parse($interest->booking_date)->format('M d, Y') }}</p>
                <p><strong>Time:</strong> {{ \Carbon\Carbon::parse($interest->booking_time)->format('h:i A') }}</p>
                <p><strong>Status:</strong> Approved</p>
            </div>

            <p>The service provider will be ready for you at the scheduled time. If you have any questions, you can contact them through our platform.</p>
            <p>Thank you for choosing Service Marketplace!</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Service Marketplace. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

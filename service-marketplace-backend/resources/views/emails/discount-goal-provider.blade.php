<!DOCTYPE html>
<html>
<head>
    <title>Goal Reached!</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .header { background-color: #2f855a; color: white; padding: 15px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { padding: 20px; }
        .stat-box { display: inline-block; background-color: #f0fff4; padding: 10px 20px; border-radius: 5px; border: 1px solid #c6f6d5; color: #2f855a; font-weight: bold; margin: 10px 0; }
        .footer { font-size: 12px; color: #777; text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Goal Reached!</h2>
        </div>
        <div class="content">
            <p>Hello {{ $discount->provider->name }},</p>
            <p>Congratulations! Your discount offer for <strong>{{ $discount->service->name }}</strong> has reached its interest goal.</p>
            
            <div style="text-align: center; margin: 20px 0;">
                <div class="stat-box">
                    Interests: {{ $discount->current_interest_count }} / {{ $discount->required_interest_count }}
                </div>
            </div>

            <p>The deal is now <strong>ACTIVATED</strong> on the platform.</p>
            <p>Customers who expressed interest have been notified and can now book your service at the discounted price.</p>
            <p>Get ready for incoming bookings!</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Service Marketplace. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

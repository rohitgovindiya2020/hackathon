<!DOCTYPE html>
<html>
<head>
    <title>Deal Cancelled</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .header { background-color: #c53030; color: white; padding: 15px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { padding: 20px; }
        .info-box { background-color: #fff5f5; padding: 15px; border-left: 4px solid #c53030; margin: 20px 0; }
        .footer { font-size: 12px; color: #777; text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Deal Cancelled</h2>
        </div>
        <div class="content">
            <p>Hello {{ $customer->name }},</p>
            <p>We're sorry to inform you that the discount deal for <strong>{{ $discount->service->name }}</strong> has been cancelled.</p>
            
            <div class="info-box">
                <p><strong>Service:</strong> {{ $discount->service->name }}</p>
                <p><strong>Provider:</strong> {{ $discount->provider->name }}</p>
                <p><strong>Reason:</strong> The deal didn't reach the required number of interested customers before the deadline.</p>
                <p><strong>Final Count:</strong> {{ $discount->current_interest_count }} / {{ $discount->required_interest_count }} customers</p>
            </div>

            <p>Thank you for your interest! Keep an eye out for future deals on our platform.</p>
            <p>We hope to serve you soon!</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Service Marketplace. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

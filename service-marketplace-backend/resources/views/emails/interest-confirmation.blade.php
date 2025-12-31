<!DOCTYPE html>
<html>
<head>
    <title>Interest Confirmed</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .header { background-color: #667eea; color: white; padding: 15px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { padding: 20px; }
        .info-box { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
        .footer { font-size: 12px; color: #777; text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>✓ Interest Confirmed!</h2>
        </div>
        <div class="content">
            <p>Hello {{ $customer->name }},</p>
            <p>Thank you for showing interest in the <strong>{{ $discount->service->name }}</strong> discount deal!</p>
            
            <div class="info-box">
                <p><strong>Service:</strong> {{ $discount->service->name }}</p>
                <p><strong>Provider:</strong> {{ $discount->provider->name }}</p>
                <p><strong>Discount:</strong> {{ $discount->discount_percentage }}% OFF</p>
                <p><strong>Goal:</strong> {{ $discount->current_interest_count }} / {{ $discount->required_interest_count }} interested customers</p>
                <p><strong>Interest Period Ends:</strong> {{ \Carbon\Carbon::parse($discount->interest_to_date)->format('M d, Y') }}</p>
            </div>

            <p>We'll notify you by email if this deal reaches its goal and becomes activated!</p>
            <p>Keep an eye on your inbox.</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Service Marketplace. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

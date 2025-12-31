<!DOCTYPE html>
<html>
<head>
    <title>Deal Activated!</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .header { background-color: #667eea; color: white; padding: 15px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { padding: 20px; }
        .cta-button { display: inline-block; background-color: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { font-size: 12px; color: #777; text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Deal Activated!</h2>
        </div>
        <div class="content">
            <p>Hello {{ $recipientData['name'] }},</p>
            <p>Great news! Typical interest goal for the <strong>{{ $discount->service->name }}</strong> discount has been reached.</p>
            <p>The deal is now activated and you can book this service at the special discounted price.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0;">
                <p><strong>Service:</strong> {{ $discount->service->name }}</p>
                <p><strong>Provider:</strong> {{ $discount->provider->name }}</p>
                <p><strong>Original Price:</strong> ${{ number_format($discount->current_price, 2) }}</p>
                <p><strong>Discounted Price:</strong> ${{ number_format($discount->price_after_discount, 2) }} ({{ $discount->discount_percentage }}% OFF)</p>
            </div>

            <p>Don't miss out! Book now to claim your discount.</p>
            
            <center>
                <a href="{{ env('FRONTEND_URL', 'http://localhost:3000') }}/service/{{ $discount->service->id }}" class="cta-button">Book Now</a>
            </center>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Service Marketplace. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

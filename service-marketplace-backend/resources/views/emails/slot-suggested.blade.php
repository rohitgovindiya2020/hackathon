<!DOCTYPE html>
<html>
<head>
    <title>Alternative Slot Suggested</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .header { background-color: #3b82f6; color: white; padding: 15px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { padding: 20px; }
        .info-box { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; }
        .footer { font-size: 12px; color: #777; text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }
        .btn { display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>📅 Alternative Slot Suggested</h2>
        </div>
        <div class="content">
            <p>Hello {{ $interest->customer->name }},</p>
            <p>The service provider for <strong>{{ $interest->discount->service->name }}</strong> has suggested an alternative booking slot as the one you requested might not be available.</p>
            
            <div class="info-box">
                <p><strong>Service:</strong> {{ $interest->discount->service->name }}</p>
                <p><strong>Proposed Date:</strong> {{ \Carbon\Carbon::parse($interest->provider_suggested_date)->format('M d, Y') }}</p>
                <p><strong>Proposed Time:</strong> {{ \Carbon\Carbon::parse($interest->provider_suggested_time)->format('h:i A') }}</p>
                <p><strong>Status:</strong> Provider Suggested</p>
            </div>

            <p>Please log in to your account to accept this new slot or suggest another time that works for you.</p>
            
            <p>Thank you for choosing Service Marketplace!</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Service Marketplace. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

<?php

namespace App\Mail;

use App\Models\Discount;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DiscountGoalReached extends Mailable
{
    use Queueable, SerializesModels;

    public $discount;
    public $type; // 'customer' or 'provider'
    public $recipientData;

    /**
     * Create a new message instance.
     */
    public function __construct(Discount $discount, $type, $recipientData = [])
    {
        $this->discount = $discount;
        $this->type = $type;
        $this->recipientData = $recipientData;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->type === 'customer' 
            ? 'Deal Activated! ' . $this->discount->service->name . ' is now available'
            : 'Goal Reached! Your discount is now active';

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $view = $this->type === 'customer'
            ? 'emails.discount-goal-customer'
            : 'emails.discount-goal-provider';

        return new Content(
            view: $view,
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}

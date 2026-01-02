<?php

namespace App\Mail;

use App\Models\DiscountInterest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SlotSuggested extends Mailable
{
    use Queueable, SerializesModels;

    public $interest;

    /**
     * Create a new message instance.
     */
    public function __construct(DiscountInterest $interest)
    {
        $this->interest = $interest->load(['customer', 'discount.service']);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Alternative Slot Suggested: ' . $this->interest->discount->service->name,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.slot-suggested',
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

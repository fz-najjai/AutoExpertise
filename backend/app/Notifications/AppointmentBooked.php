<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentBooked extends Notification implements ShouldQueue
{
    use Queueable;

    protected $appointment;

    /**
     * Create a new notification instance.
     */
    public function __construct(Appointment $appointment)
    {
        $this->appointment = $appointment;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Nouvelle Réservation - AutoExpertise')
                    ->greeting('Bonjour ' . $notifiable->name . '!')
                    ->line('Une nouvelle réservation a été créée sur votre profil.')
                    ->line('Référence: ' . $this->appointment->reference)
                    ->line('Date: ' . $this->appointment->scheduled_at)
                    ->action('Gérer mes réservations', url('/expert/requests'))
                    ->line('Merci d\'utiliser AutoExpertise !');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'appointment_id' => $this->appointment->id,
            'reference'      => $this->appointment->reference,
            'client_name'    => $this->appointment->client->name,
            'scheduled_at'   => $this->appointment->scheduled_at,
            'message'        => 'Nouvelle réservation par ' . $this->appointment->client->name,
            'type'           => 'booking_created',
        ];
    }
}

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Facture - AutoExpertise</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.6; }
        .invoice-box { max-width: 800px; margin: auto; padding: 30px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #f2f2f2; padding-bottom: 20px; }
        .logo { font-size: 28px; font-weight: bold; color: #0F172A; }
        .invoice-info { text-align: right; }
        .invoice-info h2 { margin: 0; color: #64748B; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }
        .invoice-info p { margin: 5px 0; font-weight: bold; }
        .details-grid { display: block; margin-bottom: 40px; }
        .details-grid table { width: 100%; }
        .details-grid td { vertical-align: top; width: 50%; }
        .details-grid h3 { font-size: 12px; color: #94A3B8; text-transform: uppercase; margin-bottom: 10px; }
        .details-grid p { margin: 3px 0; font-size: 14px; }
        .item-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
        .item-table th { background: #f8fafc; text-align: left; padding: 12px; border-bottom: 2px solid #cbd5e1; font-size: 12px; text-transform: uppercase; color: #475569; }
        .item-table td { padding: 15px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .total-section { text-align: right; }
        .total-section table { margin-left: auto; width: 250px; }
        .total-section td { padding: 10px 0; }
        .total-section .grand-total { font-size: 22px; font-weight: bold; color: #0F172A; }
        .footer { margin-top: 50px; text-align: center; color: #94A3B8; font-size: 12px; border-top: 1px solid #f2f2f2; padding-top: 20px; }
    </style>
</head>
<body>
    <div className="invoice-box">
        <table width="100%" style="margin-bottom: 40px;">
            <tr>
                <td className="logo">AutoExpertise</td>
                <td className="invoice-info">
                    <h2>Facture N°</h2>
                    <p>{{ $appointment->reference ?? 'INV-'.str_pad($appointment->id, 6, '0', STR_PAD_LEFT) }}</p>
                    <p>Date: {{ $appointment->created_at->format('d/m/Y') }}</p>
                </td>
            </tr>
        </table>

        <div className="details-grid">
            <table width="100%">
                <tr>
                    <td>
                        <h3>Émis par</h3>
                        <p><strong>{{ $appointment->expert->name }}</strong></p>
                        <p>{{ $appointment->expert->expertProfile->specialty }}</p>
                        <p>{{ $appointment->expert->city }}</p>
                    </td>
                    <td>
                        <h3>Facturé à</h3>
                        <p><strong>{{ $appointment->client->name }}</strong></p>
                        <p>{{ $appointment->client->email }}</p>
                        <p>Véhicule: {{ $appointment->vehicle_details }}</p>
                    </td>
                </tr>
            </table>
        </div>

        <table className="item-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th style="text-align: right;">Prix Unitaire</th>
                    <th style="text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        Diagnostic automobile à domicile<br>
                        <small style="color: #64748B;">Date d'intervention: {{ \Carbon\Carbon::parse($appointment->scheduled_at)->format('d/m/Y H:i') }}</small>
                    </td>
                    <td style="text-align: right;">{{ number_format($appointment->expert->expertProfile->price, 2) }} €</td>
                    <td style="text-align: right;">{{ number_format($appointment->expert->expertProfile->price, 2) }} €</td>
                </tr>
                <tr>
                    <td>Frais de service plateforme</td>
                    <td style="text-align: right;">1.50 €</td>
                    <td style="text-align: right;">1.50 €</td>
                </tr>
            </tbody>
        </table>

        <div className="total-section">
            <table>
                <tr>
                    <td style="color: #64748B;">Sous-total HT</td>
                    <td style="font-weight: bold;">{{ number_format($appointment->expert->expertProfile->price + 1.5, 2) }} €</td>
                </tr>
                <tr>
                    <td style="color: #64748B;">TVA (0%)</td>
                    <td style="font-weight: bold;">0.00 €</td>
                </tr>
                <tr className="grand-total">
                    <td style="padding-top: 20px;">TOTAL TTC</td>
                    <td style="padding-top: 20px;">{{ number_format($appointment->expert->expertProfile->price + 1.5, 2) }} €</td>
                </tr>
            </table>
        </div>

        <div className="footer">
            <p>Merci pour votre confiance en AutoExpertise.</p>
            <p>Cette facture est un reçu de votre paiement effectué via Stripe.</p>
        </div>
    </div>
</body>
</html>

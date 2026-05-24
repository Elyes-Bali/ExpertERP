export const internetPaymentTemplate = (payment) => {
  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString() : "-";

    const formatAddress = (addr) => {
    if (!addr) return "-";
    const parts = [
      addr.addressLine,
      addr.region,
      addr.country,
      addr.zipCode,
    ].filter(Boolean); // remove undefined/null
    return parts.join(", ");
  };

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Paiement Internet ${payment._id}</title>

    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 30px;
        background: #f8fafc;
        color: #1f2937;
      }

      .invoice-box {
        background: #fff;
        padding: 25px;
        border-radius: 12px;
        border: 1px solid #e5e7eb;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: 2px solid #4f46e5;
        padding-bottom: 15px;
        margin-bottom: 20px;
      }

      .title {
        font-size: 22px;
        font-weight: bold;
        color: #4f46e5;
        letter-spacing: 1px;
      }

      .id {
        font-size: 12px;
        color: #6b7280;
        margin-top: 5px;
      }

      .date-box {
        text-align: right;
        font-size: 13px;
        color: #6b7280;
      }

      .section {
        margin-top: 20px;
      }

      .section h3 {
        font-size: 14px;
        margin-bottom: 8px;
        color: #111827;
        border-left: 4px solid #4f46e5;
        padding-left: 8px;
      }

      .info {
        font-size: 13px;
        line-height: 1.6;
      }

      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }

      .box {
        padding: 12px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        background: #fafafa;
      }

      .total-box {
        margin-top: 25px;
        text-align: right;
        font-size: 18px;
        font-weight: bold;
        color: #fff;
        background: #4f46e5;
        padding: 12px 15px;
        border-radius: 8px;
      }

      .signature {
        margin-top: 60px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }

      .signature-box {
        width: 200px;
        text-align: left;
      }

      .signature-line {
        margin-top: 40px;
        border-top: 1px solid #111827;
        width: 180px;
      }

      .signature-label {
        font-size: 12px;
        margin-top: 5px;
        color: #6b7280;
      }

      .footer-note {
        font-size: 11px;
        color: #9ca3af;
        text-align: center;
        margin-top: 30px;
      }
         .footer-section {
      margin-top: auto;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-top: 20px;
      border-top: 1px solid var(--border-color);
    }

    .issuer-info {
      text-align: left;
    }

    footer { 
      text-align: center; 
      margin-top: 20px; 
      font-size: 10px; 
      color: var(--text-light); 
      opacity: 0.6;
    }

    </style>
  </head>

  <body>

    <div class="invoice-box">

      <!-- HEADER -->
      <div class="header">
        <div>
          <div class="title">PAIEMENT INTERNET</div>
          <div class="id">ID Facture : ${payment._id}</div>
        </div>

        <div class="date-box">
          <div><b>Date :</b> ${formatDate(payment.createdAt)}</div>
          <div><b>Période :</b> ${payment.month}/${payment.year}</div>
        </div>
      </div>

      <!-- CLIENT + CONTRACT -->
      <div class="grid">

        <div class="box">
          <h3>Informations client</h3>
          <div class="info">
            <b>Nom :</b> ${payment.client?.name || "-"} <br/>
            <b>Numéro de téléphone :</b> ${payment.client?.phone || "-"} <br/>
          </div>
        </div>

        <div class="box">
          <h3>Détails du contrat</h3>
          <div class="info">
            <b>Type :</b> ${payment.contractType?.value || "-"} Mbps <br/>
            <b>Code :</b> ${payment.contractCode || "-"}
          </div>
        </div>

      </div>

      <!-- PAYMENT -->
      <div class="total-box">
        TOTAL PAYÉ : ${payment.paidPrice} TND
      </div>

      <!-- SIGNATURE -->
      <div class="signature">

        <div class="signature-box">
          <div class="signature-line"></div>
          <div class="signature-label">Signature du client</div>
        </div>

        <div class="signature-box" style="text-align:right;">
          <div class="signature-line"></div>
          <div class="signature-label">Signature de la société</div>
        </div>

      </div>

      <div class="footer-note">
        Merci pour votre confiance — Système de facturation Internet
      </div>
          <div class="footer-section">
      <div class="footer-content">
        <div class="issuer-info address-block">
          <div class="section-title">Émis par</div>
          <strong>${payment.company?.name || "-"}</strong>
          <div style="font-size: 12px;">${formatAddress(payment.company?.address)}</div>
        </div>
        
      
      </div>

    </div>

    </div>

  </body>
  </html>
  `;
};
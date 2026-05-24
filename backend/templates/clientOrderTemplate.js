export const clientOrderTemplate = (order) => {
  // Helper to format address objects
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
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Commande client ${order.orderNumber || "-"}</title>
  <style>
    :root {
      --primary-color: #059669;
      --primary-light: #ecfdf5;
      --secondary-color: #1f2937;
      --text-main: #374151;
      --text-light: #6b7280;
      --bg-light: #f9fafb;
      --border-color: #e5e7eb;
    }

    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
      margin: 0; 
      padding: 20px; 
      color: var(--text-main);
      background-color: #f3f4f6;
      line-height: 1.4;
    }

    .container { 
      width: 100%;
      max-width: 800px; 
      margin: 0 auto; 
      background: white;
      padding: 30px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      border-radius: 8px;
      box-sizing: border-box;
      min-height: 1050px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .main-content {
      flex: 1;
    }

    header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      border-bottom: 2px solid var(--primary-light);
      padding-bottom: 20px;
      margin-bottom: 30px;
    }

    .logo-container img { 
      max-width: 120px; 
      height: auto;
    }

    .invoice-info {
      text-align: right;
    }

    h1 { 
      margin: 0; 
      font-size: 24px; 
      color: var(--primary-color); 
      letter-spacing: -0.01em;
      text-transform: uppercase;
    }

    .bill-to-section {
      margin-bottom: 30px;
    }

    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--primary-color);
      margin-bottom: 4px;
      letter-spacing: 0.05em;
    }

    .address-block {
      font-size: 13px;
      color: var(--text-main);
    }

    .address-block strong {
      font-size: 15px;
      display: block;
      margin-bottom: 2px;
      color: var(--secondary-color);
    }

    .table-container {
      width: 100%;
      overflow-x: auto;
    }

    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin-top: 10px;
    }

    th { 
      background-color: var(--primary-color); 
      color: white; 
      padding: 10px 12px; 
      text-align: left; 
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    td { 
      padding: 10px 12px; 
      border-bottom: 1px solid var(--border-color);
      font-size: 13px;
    }

    tr:nth-child(even) {
      background-color: var(--bg-light);
    }

    .row-total {
      font-weight: 600;
      color: var(--secondary-color);
    }

    .totals-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
      margin-bottom: 30px;
    }

    .totals { 
      width: 250px;
      background-color: var(--bg-light);
      padding: 15px;
      border-radius: 6px;
      border: 1px solid var(--border-color);
    }

    .total-row { 
      display: flex; 
      justify-content: space-between;
      margin-bottom: 6px; 
      font-size: 13px;
    }

    .total-row.grand-total {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 2px solid var(--primary-color);
      font-size: 16px;
      font-weight: 700;
      color: var(--primary-color);
    }

    .note-section {
      margin-top: 10px;
      padding: 15px;
      border-left: 3px solid var(--primary-light);
      background-color: var(--bg-light);
      max-width: 60%;
      border-radius: 0 4px 4px 0;
    }

    .note-title {
      font-size: 12px;
      font-weight: 700;
      color: var(--secondary-color);
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.02em;
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

    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; border: none; padding: 10px; min-height: 100vh; }
    }
  </style>
  </head>
  <body>
  <div class="container">
    <div class="main-content">
      <header>
        <div class="logo-container">
          ${order.logo ? `<img src="${order.logo}" alt="Logo" />` : `<div style="height: 40px;"></div>`}
        </div>
        <div class="invoice-info">
        <div class="logo-container">
          ${order.qrLogo ? `<img src="${order.qrLogo}" alt="Logo QR" />` : `<div style="height: 40px;"></div>`}
        </div>
          <h1>COMMANDE</h1>
          <div style="font-weight: 600; color: var(--secondary-color); font-size: 14px;">Réf: ${order.orderNumber || "-"}</div>
          <div style="color: var(--text-light); font-size: 12px;">Date: ${order.date ? new Date(order.date).toLocaleDateString() : "-"}</div>
        </div>
      </header>

      <div class="bill-to-section">
        <div class="address-block">
          <div class="section-title">Facturé à</div>
          <strong>${order.customer?.name || "-"}</strong>
          ${formatAddress(order.customer?.address)}
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th style="width: 45%">Nom du produit</th>
              <th style="text-align: center;">Unité</th>
              <th style="text-align: center;">Qté</th>
              <th style="text-align: right;">Prix</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${
              order.items
                ?.map(
                  (item) => `
              <tr>
                <td>
                  <div style="font-weight: 500; color: var(--secondary-color);">${item.name || "-"}</div>
                </td>
                <td style="text-align: center; color: var(--text-light); font-size: 12px;">${item.unit || ""}</td>
                <td style="text-align: center;">${item.quantity || 0}</td>
                <td style="text-align: right;">${(item.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} TND</td>
                <td style="text-align: right;" class="row-total">${(item.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} TND</td>
              </tr>
            `,
                )
                .join("") ||
              `
              <tr><td colspan="5" style="text-align:center; padding: 30px; color: var(--text-light);">Aucun article trouvé</td></tr>
            `
            }
          </tbody>
        </table>
      </div>

      <div class="totals-wrapper">
        <div class="totals">
          <div class="total-row">
            <span>Sous-total</span>
            <span>${(order.subtotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} TND</span>
          </div>
          <div class="total-row">
            <span style="color: var(--text-light);">TVA</span>
            <span>${(order.totalVAT || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} TND</span>
          </div>
          <div class="total-row">
            <span style="color: var(--text-light);">Taxes</span>
            <span>${(order.totalTaxes || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} TND</span>
          </div>
          <div class="total-row">
            <span style="color: var(--text-light);">Timbre Fiscal</span>
            <span>${(order.timbreFiscal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} TND</span>
          </div>
          <div class="total-row grand-total">
            <span>Net à payer</span>
            <span>${(order.netPay || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })} TND</span>
          </div>
        </div>
      </div>

      <div class="note-section">
        <div class="note-title">Notes et conditions</div>
        <div style="font-size: 13px; color: var(--text-main);">
          ${order.note || "Merci pour votre confiance !"}
        </div>
      </div>
    </div>

    <div class="footer-section">
      <div class="footer-content">
        <div class="issuer-info address-block">
          <div class="section-title">Émis par</div>
          <strong>${order.company?.name || "-"}</strong>
          <div style="font-size: 12px;">${formatAddress(order.company?.address)}</div>
        </div>
        
      
      </div>

    </div>
  </div>
  </body>
  </html>
  `;
};
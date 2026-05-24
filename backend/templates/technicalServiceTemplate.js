export const technicalServiceTemplate = (service, note) => {
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "-");

  const formatAddress = (addr) => {
    if (!addr) return "-";
    return [addr.addressLine, addr.region, addr.country, addr.zipCode]
      .filter(Boolean)
      .join(", ");
  };

  // Status badge color logic
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'background: #dcfce7; color: #15803d;';
      case 'pending': return 'background: #fef9c3; color: #a16207;';
      default: return 'background: #f1f5f9; color: #475569;';
    }
  };

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Service Technique ${service._id}</title>
    <style>
      :root {
        --primary: #0f172a;
        --secondary: #475569;
        --accent: #059669;
        --bg-light: #f8fafc;
        --border: #e2e8f0;
      }
      
      body { 
        font-family: 'Inter', system-ui, -apple-system, sans-serif; 
        color: var(--primary);
        line-height: 1.5;
        padding: 40px; 
        margin: 0;
        background: #ffffff;
      }
      
      .header { 
        display: flex; 
        justify-content: space-between; 
        align-items: flex-start;
        border-bottom: 2px solid var(--border);
        padding-bottom: 24px;
      }
      
      .title-area h1 { 
        font-size: 28px; 
        font-weight: 800; 
        letter-spacing: -0.025em;
        margin: 0 0 4px 0; 
        color: var(--primary);
      }
      
      .invoice-id {
        font-size: 14px;
        color: var(--secondary);
        font-family: monospace;
      }
      
      .meta-area { 
        text-align: right; 
        font-size: 14px;
      }
      
      .meta-row {
        margin-bottom: 6px;
      }
      
      .badge {
        padding: 3px 8px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;
        display: inline-block;
      }

      .grid-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        margin-top: 32px;
      }
      
      .info-card {
        background: var(--bg-light);
        padding: 20px;
        border-radius: 8px;
        border: 1px solid var(--border);
      }
      
      .info-card h3 {
        margin: 0 0 12px 0;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--secondary);
        border-bottom: 1px solid var(--border);
        padding-bottom: 6px;
      }
      
      .info-card p {
        margin: 6px 0;
        font-size: 14px;
      }
      
      .info-card b {
        color: var(--secondary);
        font-weight: 500;
        width: 100px;
        display: inline-block;
      }

      .table-section { margin-top: 32px; }
      .table-section h3 { font-size: 16px; margin-bottom: 12px; }
      
      table { width: 100%; border-collapse: collapse; }
      th, td { padding: 12px; text-align: left; font-size: 14px; }
      th { background: var(--bg-light); color: var(--secondary); font-weight: 600; border-bottom: 2px solid var(--border); }
      td { border-bottom: 1px solid var(--border); }
      
      .pricing-wrapper {
        display: flex;
        justify-content: flex-end;
        margin-top: 24px;
      }
      
      .pricing-table {
        width: 300px;
      }
      
      .pricing-table td {
        padding: 6px 0;
        border: none;
      }
      
      .pricing-table .total-row td {
        padding-top: 12px;
        border-top: 2px solid var(--primary);
        font-weight: 700;
        font-size: 18px;
        color: var(--accent);
      }

      .note-section {
        margin-top: 40px;
        padding: 16px;
        border-radius: 8px;
        background: #f0fdf4;
        border-left: 4px solid var(--accent);
      }

      .note-section h3 {
        margin: 0 0 6px 0;
        color: var(--accent);
        font-size: 14px;
      }

      .note-section p {
        margin: 0;
        color: #166534;
        font-size: 13px;
        white-space: pre-line;
      }

      .footer-section {
        margin-top: 60px;
        padding-top: 20px;
        border-top: 1px solid var(--border);
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        color: var(--secondary);
      }
      
      .issuer-info strong {
        color: var(--primary);
      }
    </style>
  </head>

  <body>

    <div class="header">
      <div class="title-area">
        <h1>SERVICE TECHNIQUE</h1>
        <div class="invoice-id">ID: ${service._id}</div>
      </div>

      <div class="meta-area">
        <div class="meta-row"><b>Date :</b> ${formatDate(service.createdAt)}</div>
        <div class="meta-row"><b>Statut :</b> <span class="badge" style="${getStatusColor(service.repairStatus)}">${service.repairStatus || 'N/D'}</span></div>
        <div class="meta-row"><b>Payé :</b> <span class="badge" style="${service.paidStatus === 'Paid' ? 'background:#dcfce7; color:#15803d;' : 'background:#fee2e2; color:#991b1b;'}">${service.paidStatus || 'Non payé'}</span></div>
      </div>
    </div>

    <div class="grid-info">
      <div class="info-card">
        <h3>Infos client</h3>
        <p><b>Nom :</b> ${service.clientName}</p>
        <p><b>Téléphone :</b> ${service.clientNumber}</p>
      </div>

      <div class="info-card">
        <h3>Détails de la machine</h3>
        <p><b>Type :</b> ${service.machineType?.name || "-"}</p>
        <p><b>Numéro de série :</b> ${service.serialNumber || "-"}</p>
        <p><b>Accessoires :</b> ${service.accessories || "-"}</p>
      </div>
    </div>

    <div class="table-section">
      <h3>Détail des matériaux</h3>
      <table>
        <thead>
          <tr>
            <th>Nom du matériau</th>
            <th style="text-align: center;">Qté</th>
            <th style="text-align: right;">Prix unitaire</th>
          </tr>
        </thead>
        <tbody>
          ${
            service.materials?.length 
              ? service.materials.map((m) => `
                <tr>
                  <td>${m.material?.name || "-"}</td>
                  <td style="text-align: center;">${m.quantityUsed}</td>
                  <td style="text-align: right;">${m.material?.price || 0} TND</td>
                </tr>
              `).join("") 
              : `<tr><td colspan="3" style="text-align: center; color: var(--secondary);">Aucun matériau utilisé</td></tr>`
          }
        </tbody>
      </table>
    </div>

    <div class="pricing-wrapper">
      <table class="pricing-table">
        <tr>
          <td>Main-d'œuvre :</td>
          <td style="text-align: right;">${service.workforcePrice || 0} TND</td>
        </tr>
        <tr>
          <td>Prix des matériaux :</td>
          <td style="text-align: right;">${service.materialsPrice || 0} TND</td>
        </tr>
        <tr class="total-row">
          <td>Total à payer :</td>
          <td style="text-align: right;">${service.finalPrice || 0} TND</td>
        </tr>
      </table>
    </div>

    ${
      note
        ? `
      <div class="note-section">
        <h3>Note importante</h3>
        <p>${note}</p>
      </div>
    `
        : ""
    }

    <div class="footer-section">
      <div class="issuer-info">
        <div style="font-weight: 600; text-transform: uppercase; font-size: 11px; margin-bottom: 4px; color: var(--secondary);">Émis par</div>
        <strong>${service.company?.name || "-"}</strong>
        <div style="margin-top: 2px;">${formatAddress(service.company?.address)}</div>
      </div>
      <div style="align-self: flex-end; font-size: 11px; opacity: 0.7;">
        Merci d'avoir choisi nos services techniques.
      </div>
    </div>

  </body>
  </html>
  `;
};
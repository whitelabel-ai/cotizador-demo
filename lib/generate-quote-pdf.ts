import type { Quote } from "@/data/quotes";
import type { Customer } from "@/data/customers";
import { calculateTotals } from "./quote-calculations";
import { formatCurrency, formatDate } from "./utils";

export function generateQuotePDF(quote: Quote, customer: Customer): void {
  const totals = calculateTotals(quote.items);

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cotización ${quote.number}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 12px;
      line-height: 1.5;
      color: #1a1a1a;
      background: #fff;
      padding: 20px;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #0066cc;
    }
    
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #0066cc;
    }
    
    .quote-info {
      text-align: right;
    }
    
    .quote-number {
      font-size: 18px;
      font-weight: bold;
      color: #0066cc;
    }
    
    .quote-date {
      color: #666;
      margin-top: 4px;
    }
    
    .customer-section {
      margin-bottom: 30px;
    }
    
    .section-title {
      font-size: 14px;
      font-weight: bold;
      color: #0066cc;
      margin-bottom: 10px;
      text-transform: uppercase;
    }
    
    .customer-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    
    .info-label {
      font-size: 10px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    
    .info-value {
      font-size: 12px;
      color: #1a1a1a;
      font-weight: 500;
    }
    
    .products-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    
    .products-table th {
      background: #0066cc;
      color: white;
      padding: 10px 8px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .products-table td {
      padding: 10px 8px;
      border-bottom: 1px solid #e0e0e0;
      font-size: 11px;
    }
    
    .products-table tr:nth-child(even) {
      background: #f8f9fa;
    }
    
    .text-right {
      text-align: right;
    }
    
    .text-center {
      text-align: center;
    }
    
    .totals-section {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 30px;
    }
    
    .totals-table {
      width: 300px;
      border-collapse: collapse;
    }
    
    .totals-table td {
      padding: 8px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .totals-table .total-label {
      font-weight: 500;
      color: #666;
    }
    
    .totals-table .total-value {
      text-align: right;
      font-weight: 500;
    }
    
    .totals-table .grand-total {
      font-size: 16px;
      font-weight: bold;
      color: #0066cc;
      border-top: 2px solid #0066cc;
      border-bottom: none;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      font-size: 10px;
      color: #666;
      text-align: center;
    }
    
    .notes {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 20px;
    }
    
    .notes-title {
      font-size: 11px;
      font-weight: bold;
      color: #666;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    
    .notes-content {
      font-size: 11px;
      color: #1a1a1a;
    }
    
    @media print {
      body {
        padding: 0;
      }
      
      .container {
        max-width: 100%;
      }
      
      @page {
        margin: 15mm;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="logo">QuoteAI</div>
        <div style="color: #666; margin-top: 4px;">Sistema de Cotización B2B</div>
      </div>
      <div class="quote-info">
        <div class="quote-number">Cotización ${quote.number}</div>
        <div class="quote-date">Fecha: ${formatDate(quote.createdAt)}</div>
        <div class="quote-date">Vence: ${formatDate(quote.expiresAt)}</div>
        <div class="quote-date" style="margin-top: 8px;">
          <strong>Estado:</strong> ${quote.status.replace("_", " ").toUpperCase()}
        </div>
      </div>
    </div>

    <div class="customer-section">
      <div class="section-title">Información del Cliente</div>
      <div class="customer-grid">
        <div>
          <div class="info-label">Empresa</div>
          <div class="info-value">${customer.company}</div>
          <div class="info-label" style="margin-top: 8px;">NIT / RUT</div>
          <div class="info-value">${customer.taxId}</div>
          <div class="info-label" style="margin-top: 8px;">Contacto</div>
          <div class="info-value">${customer.contact}</div>
        </div>
        <div>
          <div class="info-label">Email</div>
          <div class="info-value">${customer.email}</div>
          <div class="info-label" style="margin-top: 8px;">Teléfono</div>
          <div class="info-value">${customer.phone}</div>
          <div class="info-label" style="margin-top: 8px;">Ciudad</div>
          <div class="info-value">${customer.city}</div>
        </div>
      </div>
    </div>

    <div class="section-title" style="margin-top: 30px;">Productos Cotizados</div>
    <table class="products-table">
      <thead>
        <tr>
          <th style="width: 80px;">SKU</th>
          <th>Producto</th>
          <th style="width: 60px;" class="text-center">Qty</th>
          <th style="width: 100px;" class="text-right">Precio Unit.</th>
          <th style="width: 70px;" class="text-center">Desc.</th>
          <th style="width: 100px;" class="text-right">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${quote.items.map((item) => `
          <tr>
            <td>${item.sku}</td>
            <td>
              <div style="font-weight: 500;">${item.name}</div>
              <div style="color: #666; font-size: 10px;">${item.brand}</div>
            </td>
            <td class="text-center">${item.qty}</td>
            <td class="text-right">${formatCurrency(item.unitPrice)}</td>
            <td class="text-center">${item.discountPercent > 0 ? `${item.discountPercent}%` : "-"}</td>
            <td class="text-right">${formatCurrency(item.unitPrice * item.qty * (1 - item.discountPercent / 100))}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div class="totals-section">
      <table class="totals-table">
        <tr>
          <td class="total-label">Subtotal (${totals.itemCount} uds.)</td>
          <td class="total-value">${formatCurrency(totals.subtotal)}</td>
        </tr>
        ${totals.discountAmount > 0 ? `
          <tr>
            <td class="total-label">Descuentos</td>
            <td class="total-value" style="color: #059669;">- ${formatCurrency(totals.discountAmount)}</td>
          </tr>
        ` : ""}
        <tr>
          <td class="total-label">IVA (19%)</td>
          <td class="total-value">${formatCurrency(totals.tax)}</td>
        </tr>
        <tr class="grand-total">
          <td class="total-label">TOTAL</td>
          <td class="total-value">${formatCurrency(totals.total)}</td>
        </tr>
      </table>
    </div>

    ${quote.notes ? `
      <div class="notes">
        <div class="notes-title">Notas</div>
        <div class="notes-content">${quote.notes}</div>
      </div>
    ` : ""}

    <div class="footer">
      <div style="margin-bottom: 8px;">
        <strong>Vendedor:</strong> ${quote.repName} · ${customer.assignedRep}
      </div>
      <div>
        Esta cotización tiene una validez de 15 días hábiles. Precios sujetos a disponibilidad de stock.
      </div>
      <div style="margin-top: 8px;">
        Generado por QuoteAI el ${new Date().toLocaleDateString("es-CO", { 
          year: "numeric", 
          month: "long", 
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })}
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
  `;

  const printWindow = window.open("", "_blank", "width=800,height=600");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  } else {
    console.error("[PDF] No se pudo abrir la ventana de impresión");
  }
}

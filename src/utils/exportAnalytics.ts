import { format } from 'date-fns';

interface ExportData {
  salesStats: {
    todaySales: number;
    weeklySales: number;
    monthlySales: number;
    totalRevenue: number;
  };
  orderStats: {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  dailySales: Array<{
    date: string;
    sales: number;
    orders: number;
  }>;
  topProducts: Array<{
    product_name: string;
    quantity: number;
    revenue: number;
  }>;
  dateRange: {
    from: Date;
    to: Date;
  };
}

export const exportToCSV = (data: ExportData) => {
  const { salesStats, orderStats, dailySales, topProducts, dateRange } = data;
  
  let csv = '';
  
  // Header
  csv += `Analytics Report\n`;
  csv += `Date Range: ${format(dateRange.from, 'PPP')} - ${format(dateRange.to, 'PPP')}\n`;
  csv += `Generated: ${format(new Date(), 'PPP p')}\n\n`;
  
  // Sales Summary
  csv += `SALES SUMMARY\n`;
  csv += `Metric,Value\n`;
  csv += `Today's Sales,$${salesStats.todaySales.toFixed(2)}\n`;
  csv += `Weekly Sales,$${salesStats.weeklySales.toFixed(2)}\n`;
  csv += `Monthly Sales,$${salesStats.monthlySales.toFixed(2)}\n`;
  csv += `Total Revenue,$${salesStats.totalRevenue.toFixed(2)}\n\n`;
  
  // Order Statistics
  csv += `ORDER STATISTICS\n`;
  csv += `Status,Count\n`;
  csv += `Total Orders,${orderStats.total}\n`;
  csv += `Pending,${orderStats.pending}\n`;
  csv += `Processing,${orderStats.processing}\n`;
  csv += `Shipped,${orderStats.shipped}\n`;
  csv += `Delivered,${orderStats.delivered}\n`;
  csv += `Cancelled,${orderStats.cancelled}\n\n`;
  
  // Daily Sales
  csv += `DAILY SALES\n`;
  csv += `Date,Sales,Orders\n`;
  dailySales.forEach(day => {
    csv += `${day.date},$${day.sales.toFixed(2)},${day.orders}\n`;
  });
  csv += `\n`;
  
  // Top Products
  csv += `TOP PRODUCTS\n`;
  csv += `Product,Quantity Sold,Revenue\n`;
  topProducts.forEach(product => {
    csv += `"${product.product_name}",${product.quantity},$${product.revenue.toFixed(2)}\n`;
  });
  
  // Download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `analytics-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (data: ExportData) => {
  const { salesStats, orderStats, dailySales, topProducts, dateRange } = data;
  
  // Create a printable HTML document
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Analytics Report</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 40px;
          color: #1a1a1a;
          line-height: 1.6;
        }
        .header { 
          text-align: center; 
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #166534;
        }
        .header h1 { 
          color: #166534; 
          font-size: 28px;
          margin-bottom: 8px;
        }
        .header p { color: #666; font-size: 14px; }
        .section { margin-bottom: 32px; }
        .section h2 { 
          color: #166534; 
          font-size: 18px;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5e5e5;
        }
        .stats-grid { 
          display: grid; 
          grid-template-columns: repeat(2, 1fr); 
          gap: 16px; 
        }
        .stat-card { 
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid #e5e5e5;
        }
        .stat-card .label { color: #666; font-size: 13px; }
        .stat-card .value { font-size: 24px; font-weight: 700; color: #166534; }
        table { 
          width: 100%; 
          border-collapse: collapse;
          font-size: 14px;
        }
        th, td { 
          padding: 12px; 
          text-align: left; 
          border-bottom: 1px solid #e5e5e5;
        }
        th { 
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
        }
        tr:hover { background: #f9fafb; }
        .text-right { text-align: right; }
        .footer { 
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e5e5;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
        @media print {
          body { padding: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📊 Analytics Report</h1>
        <p>Date Range: ${format(dateRange.from, 'PPP')} - ${format(dateRange.to, 'PPP')}</p>
        <p>Generated: ${format(new Date(), 'PPP p')}</p>
      </div>
      
      <div class="section">
        <h2>Sales Summary</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="label">Today's Sales</div>
            <div class="value">${formatCurrency(salesStats.todaySales)}</div>
          </div>
          <div class="stat-card">
            <div class="label">Weekly Sales</div>
            <div class="value">${formatCurrency(salesStats.weeklySales)}</div>
          </div>
          <div class="stat-card">
            <div class="label">Monthly Sales</div>
            <div class="value">${formatCurrency(salesStats.monthlySales)}</div>
          </div>
          <div class="stat-card">
            <div class="label">Total Revenue</div>
            <div class="value">${formatCurrency(salesStats.totalRevenue)}</div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h2>Order Statistics</h2>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th class="text-right">Count</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Total Orders</td><td class="text-right">${orderStats.total}</td></tr>
            <tr><td>Pending</td><td class="text-right">${orderStats.pending}</td></tr>
            <tr><td>Processing</td><td class="text-right">${orderStats.processing}</td></tr>
            <tr><td>Shipped</td><td class="text-right">${orderStats.shipped}</td></tr>
            <tr><td>Delivered</td><td class="text-right">${orderStats.delivered}</td></tr>
            <tr><td>Cancelled</td><td class="text-right">${orderStats.cancelled}</td></tr>
          </tbody>
        </table>
      </div>
      
      <div class="section">
        <h2>Daily Sales</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th class="text-right">Sales</th>
              <th class="text-right">Orders</th>
            </tr>
          </thead>
          <tbody>
            ${dailySales.map(day => `
              <tr>
                <td>${day.date}</td>
                <td class="text-right">${formatCurrency(day.sales)}</td>
                <td class="text-right">${day.orders}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="section">
        <h2>Top Products</h2>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th class="text-right">Qty Sold</th>
              <th class="text-right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            ${topProducts.map((product, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${product.product_name}</td>
                <td class="text-right">${product.quantity}</td>
                <td class="text-right">${formatCurrency(product.revenue)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="footer">
        <p>This report was automatically generated by the store analytics system.</p>
      </div>
      
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;
  
  printWindow.document.write(html);
  printWindow.document.close();
};

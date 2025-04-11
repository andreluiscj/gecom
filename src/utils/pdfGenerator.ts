import { PedidoCompra } from '@/types';
import { formatCurrency, formatDate } from './formatters';
import { GecomLogo } from '@/assets/GecomLogo';
import { MosaicoLogo } from '@/assets/MosaicoLogo';

export const gerarPDF = (pedido: PedidoCompra) => {
  // In a real application, we would use a library like jspdf or pdfmake
  // to generate the PDF. For this demo, we'll create a new window with
  // the PDF preview.
  
  // Prepare the content
  const htmlContent = `
    <html>
    <head>
      <title>DFD - ${pedido.descricao}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { text-align: center; margin-bottom: 30px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        .section h3 { border-bottom: 1px solid #ccc; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table th, table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        table th { background-color: #f2f2f2; }
        .footer { margin-top: 50px; text-align: center; }
        .row { display: flex; margin-bottom: 10px; }
        .row .label { font-weight: bold; width: 200px; }
      </style>
    </head>
    <body>
      <h1>DOCUMENTO DE FORMALIZAÇÃO DE DEMANDA (DFD)</h1>
      
      <div class="section">
        <h3>1. IDENTIFICAÇÃO DO REQUISITANTE</h3>
        <div class="row">
          <div class="label">Secretaria Solicitante:</div>
          <div>${pedido.setor}</div>
        </div>
        <div class="row">
          <div class="label">Unidade Administrativa:</div>
          <div>${pedido.fundoMonetario}</div>
        </div>
        <div class="row">
          <div class="label">Responsável pela Solicitação:</div>
          <div>${pedido.solicitante || '-'}</div>
        </div>
        <div class="row">
          <div class="label">Data do Pedido:</div>
          <div>${formatDate(pedido.dataCompra)}</div>
        </div>
      </div>
      
      <div class="section">
        <h3>2. DESCRIÇÃO DO OBJETO</h3>
        <p>${pedido.descricao}</p>
      </div>
      
      <div class="section">
        <h3>3. JUSTIFICATIVA DA NECESSIDADE</h3>
        <p>${pedido.justificativa || 'Não informada'}</p>
      </div>
      
      <div class="section">
        <h3>4. QUANTIDADE E ESPECIFICAÇÕES</h3>
        <table>
          <thead>
            <tr>
              <th style="width: 5%">Item</th>
              <th style="width: 50%">Descrição</th>
              <th style="width: 15%">Quantidade</th>
              <th style="width: 15%">Valor Unitário</th>
              <th style="width: 15%">Valor Total</th>
            </tr>
          </thead>
          <tbody>
            ${pedido.itens.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.nome}</td>
                <td>${item.quantidade}</td>
                <td>${formatCurrency(item.valorUnitario)}</td>
                <td>${formatCurrency(item.valorTotal)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="4" style="text-align: right; font-weight: bold">TOTAL</td>
              <td style="font-weight: bold">${formatCurrency(pedido.valorTotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div class="section">
        <h3>5. LOCAL DE ENTREGA</h3>
        <p>${pedido.localEntrega || 'Não informado'}</p>
      </div>
      
      ${pedido.observacoes ? `
        <div class="section">
          <h3>6. OBSERVAÇÕES ADICIONAIS</h3>
          <p>${pedido.observacoes}</p>
        </div>
      ` : ''}
      
      <div class="footer">
        <p>____________________________________________</p>
        <p>${pedido.solicitante || 'Responsável'}</p>
        <p>${pedido.setor} - ${formatDate(new Date())}</p>
      </div>
    </body>
    </html>
  `;
  
  // Open new window with the PDF preview
  const win = window.open('', '_blank');
  if (win) {
    win.document.write(htmlContent);
    win.document.close();
    win.setTimeout(() => {
      win.print();
    }, 500);
  } else {
    // If popup is blocked, offer download instead
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `DFD_${pedido.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Function to export dashboard data as PDF based on current active tab
export const exportDashboardAsPDF = (data: any, activeTab: string, chartData: any, deptData: any) => {
  const htmlContent = `
    <html>
    <head>
      <title>Dashboard - ${data.municipio}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { text-align: center; margin-bottom: 20px; }
        .logos { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .gecom-logo { text-align: left; }
        .mosaico-logo { text-align: right; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        .section h3 { border-bottom: 1px solid #ccc; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table th, table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        table th { background-color: #f2f2f2; }
        .footer { margin-top: 50px; text-align: center; }
        .chart-placeholder { height: 300px; border: 1px dashed #ccc; display: flex; justify-content: center; align-items: center; margin: 20px 0; }
        .data-row { display: flex; margin-bottom: 10px; }
        .data-row .label { font-weight: bold; width: 200px; }
        .data-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        .dept-item { border: 1px solid #eee; padding: 10px; border-radius: 4px; }
        .dept-name { font-weight: bold; margin-bottom: 5px; }
      </style>
    </head>
    <body>
      <div class="logos">
        <div class="gecom-logo">
          <div style="width: 48px; height: 48px; background-color: white; border-radius: 8px; display: flex; justify-content: center; align-items: center; font-size: 28px; color: #9b87f5; font-weight: bold;">$</div>
        </div>
        <div class="mosaico-logo">
          <img src="/lovable-uploads/b81639ad-2b05-401a-8fbe-8b05c81df9ce.png" alt="Mosaico Logo" width="100" />
        </div>
      </div>
      
      <h1>Relatório de Dashboard - ${data.municipio}</h1>
      <div class="header">
        <div>Data de geração: ${new Date().toLocaleDateString('pt-BR')}</div>
      </div>
      
      <div class="section">
        <h3>Resumo dos Indicadores</h3>
        <table>
          <tr>
            <th>Indicador</th>
            <th>Valor</th>
          </tr>
          <tr>
            <td>Total de Pedidos</td>
            <td>${data.totalPedidos}</td>
          </tr>
          <tr>
            <td>Orçamento Executado</td>
            <td>${formatCurrency(data.orcamentoExecutado)}</td>
          </tr>
          <tr>
            <td>Pedidos Aprovados</td>
            <td>${data.pedidosAprovados}</td>
          </tr>
          <tr>
            <td>Secretarias</td>
            <td>${data.secretarias}</td>
          </tr>
        </table>
      </div>
      
      ${activeTab === 'orcamento' ? `
        <div class="section">
          <h3>Orçamento - Comparativo Mensal</h3>
          <table>
            <tr>
              <th>Mês</th>
              <th>Planejado</th>
              <th>Executado</th>
              <th>Diferença</th>
            </tr>
            ${chartData.map((item: any) => `
            <tr>
              <td>${item.name}</td>
              <td>${formatCurrency(item.planejado)}</td>
              <td>${formatCurrency(item.executado)}</td>
              <td>${formatCurrency(item.planejado - item.executado)}</td>
            </tr>
            `).join('')}
            <tr>
              <td colspan="1" style="text-align: right; font-weight: bold">TOTAL</td>
              <td style="font-weight: bold">${formatCurrency(chartData.reduce((sum: number, item: any) => sum + item.planejado, 0))}</td>
              <td style="font-weight: bold">${formatCurrency(chartData.reduce((sum: number, item: any) => sum + item.executado, 0))}</td>
              <td style="font-weight: bold">${formatCurrency(
                chartData.reduce((sum: number, item: any) => sum + item.planejado, 0) - 
                chartData.reduce((sum: number, item: any) => sum + item.executado, 0)
              )}</td>
            </tr>
          </table>
        </div>
      ` : activeTab === 'secretarias' ? `
        <div class="section">
          <h3>Distribuição por Secretaria</h3>
          <table>
            <tr>
              <th>Secretaria</th>
              <th>Valor</th>
              <th>Percentual</th>
            </tr>
            ${deptData.map((item: any) => `
            <tr>
              <td>${item.name}</td>
              <td>${formatCurrency(item.valor)}</td>
              <td>${item.percent}%</td>
            </tr>
            `).join('')}
          </table>
        </div>
      ` : `
        <div class="section">
          <h3>Tendências e Projeções</h3>
          <p>Este relatório contém dados de tendências e projeções orçamentárias para os próximos períodos.</p>
          
          <div class="data-grid">
            ${chartData.slice(0, 6).map((item: any) => `
              <div class="dept-item">
                <div class="dept-name">${item.name}</div>
                <div>Executado: ${formatCurrency(item.executado)}</div>
                <div>Projeção: ${formatCurrency(item.executado * 1.05)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `}
      
      <div class="footer">
        <p>Relatório gerado automaticamente pelo sistema GECOM</p>
        <p>© ${new Date().getFullYear()} - Todos os direitos reservados</p>
      </div>
    </body>
    </html>
  `;
  
  // Open new window with the PDF preview
  const win = window.open('', '_blank');
  if (win) {
    win.document.write(htmlContent);
    win.document.close();
    win.setTimeout(() => {
      win.print();
    }, 500);
  } else {
    // If popup is blocked, offer download instead
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Dashboard_${data.municipio.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  return true;
};

// Keep the CSV export function
export const exportDashboardToCSV = (data: any, chartData: any, departmentData: any) => {
  // Header row with metadata
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Add metadata section
  csvContent += "RELATÓRIO DE DASHBOARD - SISTEMA GECOM\r\n";
  csvContent += `Município:,${data.municipio}\r\n`;
  csvContent += `Data do relatório:,${new Date().toLocaleDateString('pt-BR')}\r\n\r\n`;
  
  // Add summary stats section
  csvContent += "RESUMO DOS INDICADORES\r\n";
  csvContent += "Indicador,Valor\r\n";
  csvContent += `Total de Pedidos,${data.totalPedidos}\r\n`;
  csvContent += `Orçamento Executado,${formatCurrency(data.orcamentoExecutado)}\r\n`;
  csvContent += `Pedidos Aprovados,${data.pedidosAprovados}\r\n`;
  csvContent += `Secretarias,${data.secretarias}\r\n\r\n`;
  
  // Add monthly budget comparison data
  csvContent += "COMPARATIVO ORÇAMENTÁRIO MENSAL\r\n";
  csvContent += "Mês,Planejado,Executado,Diferença\r\n";
  
  chartData.forEach((row: any) => {
    const diferenca = row.planejado - row.executado;
    csvContent += `${row.name},${row.planejado},${row.executado},${diferenca}\r\n`;
  });
  
  csvContent += "\r\n";
  
  // Add department data
  csvContent += "DISTRIBUIÇÃO POR SECRETARIA\r\n";
  csvContent += "Secretaria,Valor,Percentual\r\n";
  
  departmentData.forEach((row: any) => {
    csvContent += `${row.name},${row.valor},${row.percent}%\r\n`;
  });
  
  csvContent += "\r\n";
  
  // Add date-based analytics section
  csvContent += "ANÁLISE POR PERÍODO\r\n";
  csvContent += "Período,Orçamento Total,Executado Total,Percentual Executado\r\n";
  csvContent += `Ano atual,${formatCurrency(data.orcamentoAnual)},${formatCurrency(data.orcamentoExecutado)},${(data.orcamentoExecutado/data.orcamentoAnual*100).toFixed(2)}%\r\n`;
  
  // Download the CSV file
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `dashboard_${data.municipio.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return true;
};

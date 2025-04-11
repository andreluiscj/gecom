import { PedidoCompra } from '@/types';
import { formatCurrency, formatDate } from './formatters';
import { GecomLogo } from '@/assets/GecomLogo';
import { MosaicoLogo } from '@/assets/MosaicoLogo';
import { toast } from "sonner";
import html2canvas from 'html2canvas';

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
export const exportDashboardAsPDF = async (data: any, activeTab: string, chartData: any, deptData: any) => {
  try {
    toast.success('Capturando dashboard para PDF...');
    
    // First, capture the current dashboard view as an image
    const dashboardView = document.querySelector('.dashboard-view') || document.querySelector('.space-y-6');
    if (!dashboardView) {
      toast.error('Não foi possível localizar a visualização do dashboard');
      return false;
    }
    
    // Take a screenshot of the dashboard content
    const canvas = await html2canvas(dashboardView as HTMLElement, {
      scale: 2, // Higher resolution
      useCORS: true, // Allow cross-origin images
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
      windowHeight: 1800,
      ignoreElements: (element) => {
        // Ignore sidebar, navigation, and other elements that shouldn't be in the PDF
        return element.classList.contains('sidebar') || 
               element.classList.contains('navbar') ||
               element.tagName === 'BUTTON';
      }
    });
    
    const dashboardImage = canvas.toDataURL('image/png');
    
    // Generate PDF content
    const htmlContent = `
      <html>
      <head>
        <title>Dashboard - ${data.municipio}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
          .header { padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eaeaea; }
          .logos { display: flex; justify-content: space-between; width: 100%; }
          .gecom-logo { text-align: left; }
          .mosaico-logo { text-align: right; }
          h1 { text-align: center; margin: 20px 0; }
          .timestamp { text-align: center; color: #666; margin-bottom: 20px; }
          .dashboard-image { width: 100%; max-width: 100%; }
          .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eaeaea; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logos">
            <div class="gecom-logo">
              <div style="width: 48px; height: 48px; background-color: white; border-radius: 8px; display: flex; justify-content: center; align-items: center; font-size: 28px; color: #9b87f5; font-weight: bold;">G</div>
            </div>
            <div class="mosaico-logo">
              <img src="/lovable-uploads/b81639ad-2b05-401a-8fbe-8b05c81df9ce.png" alt="Mosaico Logo" width="150" />
            </div>
          </div>
        </div>
        
        <h1>Dashboard - ${data.municipio}</h1>
        <div class="timestamp">Data de geração: ${new Date().toLocaleDateString('pt-BR')}</div>
        
        <img src="${dashboardImage}" alt="Dashboard Screenshot" class="dashboard-image">
        
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
      }, 1000);  // Increased timeout for better rendering
    } else {
      // If popup is blocked, offer download instead
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Dashboard_${data.municipio.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast("Seu navegador bloqueou a janela de impressão. O arquivo foi baixado automaticamente.");
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    toast.error('Erro ao gerar PDF. Verifique o console para mais detalhes.');
    return false;
  }
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

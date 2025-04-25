
import { PedidoCompra } from '@/types';
import { formatCurrency, formatDate } from './formatters';
import { toast } from "sonner";
import html2canvas from 'html2canvas';

// Função para gerar PDF de um pedido individual
export const gerarPDF = (pedido: PedidoCompra) => {
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
          <div>${pedido.fundoMonetario || '-'}</div>
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
  
  // Abre nova janela com o conteúdo do PDF para impressão
  const win = window.open('', '_blank');
  if (win) {
    win.document.write(htmlContent);
    win.document.close();
    win.setTimeout(() => {
      win.print();
    }, 500);
  } else {
    // Se o popup for bloqueado, oferece download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `DFD_${pedido.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Função para exportar dados do dashboard como PDF
export const exportDashboardAsPDF = async (data: any, activeTab: string, chartData: any, deptData: any) => {
  try {
    toast.success('Capturando dashboard para PDF...');
    
    // Primeiro, captura a visualização atual do dashboard como imagem
    const dashboardView = document.querySelector('.dashboard-view');
    if (!dashboardView) {
      toast.error('Não foi possível localizar a visualização do dashboard');
      return false;
    }
    
    // Captura todos os gráficos individualmente para melhor qualidade
    const charts: HTMLCanvasElement[] = [];
    
    // Captura os elementos de gráficos
    const chartElements = dashboardView.querySelectorAll('.recharts-wrapper');
    
    // Usa Promise.all para esperar todas as capturas de gráficos
    await Promise.all(Array.from(chartElements).map(async (chart, index) => {
      const canvas = await html2canvas(chart as HTMLElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      charts.push(canvas);
    }));
    
    // Captura todo o dashboard para contexto geral
    const canvas = await html2canvas(dashboardView as HTMLElement, {
      scale: 1.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      ignoreElements: (element) => {
        return element.classList.contains('sidebar') || 
               element.classList.contains('navbar') ||
               element.tagName === 'BUTTON';
      }
    });
    
    const dashboardImage = canvas.toDataURL('image/png');
    
    // Preparar conteúdo HTML para o PDF
    const statsCards = dashboardView.querySelector('.grid.gap-4');
    
    // Gerar HTML para o PDF
    const htmlContent = `
      <html>
      <head>
        <title>Dashboard - ${data.municipio}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
          .container { max-width: 1000px; margin: 0 auto; padding: 20px; }
          .header { padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eaeaea; }
          h1, h2, h3 { margin: 20px 0; color: #333; }
          h1 { text-align: center; font-size: 24px; }
          h2 { font-size: 20px; }
          h3 { font-size: 16px; }
          .timestamp { text-align: center; color: #666; margin-bottom: 20px; font-style: italic; }
          .stats { display: flex; flex-wrap: wrap; gap: 20px; margin: 20px 0; }
          .stat-card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; flex: 1; min-width: 200px; }
          .stat-title { font-weight: bold; color: #555; margin-bottom: 5px; }
          .stat-value { font-size: 24px; font-weight: bold; color: #000; }
          .charts-container { margin: 30px 0; }
          .chart { margin: 20px 0; border: 1px solid #eee; padding: 10px; border-radius: 8px; }
          .chart-title { font-weight: bold; margin-bottom: 10px; }
          img { max-width: 100%; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #777; border-top: 1px solid #eaeaea; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Dashboard - ${data.municipio}</h1>
          <div class="timestamp">Data de geração: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</div>
          
          <h2>Resumo dos Indicadores</h2>
          <div class="stats">
            <div class="stat-card">
              <div class="stat-title">Total de Pedidos</div>
              <div class="stat-value">${data.totalPedidos}</div>
            </div>
            <div class="stat-card">
              <div class="stat-title">Orçamento Executado</div>
              <div class="stat-value">${formatCurrency(data.orcamentoExecutado)}</div>
            </div>
            <div class="stat-card">
              <div class="stat-title">Pedidos Aprovados</div>
              <div class="stat-value">${data.pedidosAprovados}</div>
            </div>
            <div class="stat-card">
              <div class="stat-title">Secretarias</div>
              <div class="stat-value">${data.secretarias}</div>
            </div>
          </div>
          
          <h2>Visão Geral</h2>
          <div class="chart">
            <img src="${dashboardImage}" alt="Visão geral do dashboard">
          </div>
          
          ${charts.length > 0 ? `
            <h2>Gráficos Detalhados</h2>
            <div class="charts-container">
              ${charts.map((chart, i) => `
                <div class="chart">
                  <div class="chart-title">Gráfico ${i+1}</div>
                  <img src="${chart.toDataURL('image/png')}" alt="Gráfico ${i+1}">
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          <h2>Comparativo Orçamentário</h2>
          <table>
            <thead>
              <tr>
                <th>Mês</th>
                <th>Planejado</th>
                <th>Executado</th>
                <th>Diferença</th>
              </tr>
            </thead>
            <tbody>
              ${chartData.map((row: any) => `
                <tr>
                  <td>${row.name}</td>
                  <td>${formatCurrency(row.planejado)}</td>
                  <td>${formatCurrency(row.executado)}</td>
                  <td>${formatCurrency(row.planejado - row.executado)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <h2>Distribuição por Secretaria</h2>
          <table>
            <thead>
              <tr>
                <th>Secretaria</th>
                <th>Valor</th>
                <th>Percentual</th>
              </tr>
            </thead>
            <tbody>
              ${deptData.map((row: any) => `
                <tr>
                  <td>${row.name}</td>
                  <td>${formatCurrency(row.valor)}</td>
                  <td>${row.percent}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Relatório gerado automaticamente pelo sistema GECOM</p>
            <p>© ${new Date().getFullYear()} - Todos os direitos reservados</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Abrir nova janela com o conteúdo do PDF para impressão
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(htmlContent);
      win.document.close();
      win.setTimeout(() => {
        win.print();
      }, 1000);
    } else {
      // Se o popup for bloqueado, oferece download
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

import { PedidoCompra } from '@/types';
import { formatCurrency, formatDate } from './formatters';
import { GecomLogo } from '@/assets/GecomLogo';
import { MosaicoLogo } from '@/assets/MosaicoLogo';
import { toast } from "@/hooks/use-toast";

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
        h1 { text-align: center; margin-bottom: 20px; color: #333; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .logos { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .gecom-logo { text-align: left; }
        .mosaico-logo { text-align: right; }
        .section { margin-bottom: 30px; }
        .section h3 { border-bottom: 1px solid #ccc; padding-bottom: 5px; color: #555; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        table th, table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        table th { background-color: #f2f2f2; }
        .chart-placeholder { height: 300px; border: 1px dashed #ccc; display: flex; justify-content: center; align-items: center; margin: 20px 0; background-color: #f9f9f9; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #777; }
        .stat-card { border: 1px solid #eaeaea; padding: 15px; margin-bottom: 15px; border-radius: 8px; background-color: #f9f9f9; }
        .stat-card .title { font-size: 14px; color: #666; margin-bottom: 5px; }
        .stat-card .value { font-size: 20px; font-weight: bold; color: #333; }
        .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px; }
        .dept-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
        .dept-item { padding: 10px; border: 1px solid #eee; border-radius: 4px; margin-bottom: 10px; }
        .dept-name { font-weight: bold; margin-bottom: 5px; }
        .trend-note { background-color: #f0f7ff; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; }
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
      <p style="text-align: center; margin-bottom: 30px; color: #666;">Data de geração: ${new Date().toLocaleDateString('pt-BR')}</p>
      
      <div class="section">
        <h3>Indicadores Principais</h3>
        <div class="stat-grid">
          <div class="stat-card">
            <div class="title">Total de Pedidos</div>
            <div class="value">${data.totalPedidos}</div>
            <div style="color: green; font-size: 12px;">↑ 12.5% em relação ao período anterior</div>
          </div>
          <div class="stat-card">
            <div class="title">Orçamento Executado</div>
            <div class="value">${formatCurrency(data.orcamentoExecutado)}</div>
            <div style="color: green; font-size: 12px;">↑ 8.2% em relação ao período anterior</div>
          </div>
          <div class="stat-card">
            <div class="title">Pedidos Aprovados</div>
            <div class="value">${data.pedidosAprovados}</div>
            <div style="color: green; font-size: 12px;">↑ 4.3% em relação ao período anterior</div>
          </div>
        </div>
      </div>
      
      ${activeTab === 'orcamento' ? `
        <div class="section">
          <h3>Análise Orçamentária</h3>
          <div class="chart-placeholder">
            <p style="text-align: center;">
              <strong>Gráfico: Comparativo Orçamento Planejado vs. Executado</strong><br>
              <span style="color: #666;">O gráfico mostra a comparação entre orçamento planejado e executado ao longo do período.</span>
            </p>
          </div>
          
          <table>
            <tr>
              <th>Mês</th>
              <th>Planejado</th>
              <th>Executado</th>
              <th>Diferença</th>
              <th>% Executado</th>
            </tr>
            ${chartData.map((item: any) => `
            <tr>
              <td>${item.name}</td>
              <td>${formatCurrency(item.planejado)}</td>
              <td>${formatCurrency(item.executado)}</td>
              <td>${formatCurrency(item.planejado - item.executado)}</td>
              <td>${((item.executado / item.planejado) * 100).toFixed(1)}%</td>
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
              <td style="font-weight: bold">${(
                (chartData.reduce((sum: number, item: any) => sum + item.executado, 0) / 
                chartData.reduce((sum: number, item: any) => sum + item.planejado, 0)) * 100
              ).toFixed(1)}%</td>
            </tr>
          </table>
          
          <div class="chart-placeholder">
            <p style="text-align: center;">
              <strong>Gráfico: Tendência de Gastos Mensais</strong><br>
              <span style="color: #666;">O gráfico ilustra a tendência de gastos ao longo dos meses.</span>
            </p>
          </div>
        </div>
      ` : activeTab === 'secretarias' ? `
        <div class="section">
          <h3>Distribuição por Secretaria</h3>
          
          <div style="display: flex; margin-bottom: 30px;">
            <div style="flex: 1;">
              <div class="chart-placeholder">
                <p style="text-align: center;">
                  <strong>Gráfico: Distribuição por Secretaria</strong><br>
                  <span style="color: #666;">O gráfico de pizza mostra a distribuição percentual do orçamento.</span>
                </p>
              </div>
            </div>
            <div style="flex: 1;">
              <div class="chart-placeholder">
                <p style="text-align: center;">
                  <strong>Gráfico: Gastos por Secretaria</strong><br>
                  <span style="color: #666;">O gráfico de barras compara os gastos entre secretarias.</span>
                </p>
              </div>
            </div>
          </div>
          
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
            <tr>
              <td style="text-align: right; font-weight: bold">TOTAL</td>
              <td style="font-weight: bold">${formatCurrency(deptData.reduce((sum: number, item: any) => sum + item.valor, 0))}</td>
              <td style="font-weight: bold">100%</td>
            </tr>
          </table>
          
          <h4 style="margin-top: 30px;">Detalhamento por Secretaria</h4>
          <div class="dept-grid">
            ${deptData.slice(0, 6).map((dept: any) => `
              <div class="dept-item">
                <div class="dept-name">${dept.name}</div>
                <div>Valor: ${formatCurrency(dept.valor)}</div>
                <div>Percentual: ${dept.percent}%</div>
                <div style="background-color: #eee; height: 10px; margin-top: 5px;">
                  <div style="background-color: #9b87f5; height: 10px; width: ${dept.percent}%;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : `
        <div class="section">
          <h3>Tendências e Projeções</h3>
          
          <div class="chart-placeholder">
            <p style="text-align: center;">
              <strong>Gráfico: Tendências e Projeções</strong><br>
              <span style="color: #666;">O gráfico mostra tendências e projeções para o próximo período.</span>
            </p>
          </div>
          
          <div class="trend-note">
            <strong>Análise de Tendência:</strong> Com base nos dados históricos, projeta-se um aumento de aproximadamente 5% nos gastos para os próximos meses. A execução orçamentária segue dentro dos limites planejados.
          </div>
          
          <h4>Projeções para os Próximos Períodos</h4>
          <table>
            <tr>
              <th>Mês</th>
              <th>Executado</th>
              <th>Projeção</th>
              <th>Variação</th>
            </tr>
            ${chartData.slice(chartData.length > 6 ? chartData.length - 3 : 0).map((item: any, index: number) => `
            <tr>
              <td>${item.name}</td>
              <td>${formatCurrency(item.executado)}</td>
              <td>${formatCurrency(item.executado * 1.05)}</td>
              <td>+5.0%</td>
            </tr>
            `).join('')}
            ${['Próximo', 'Em 2 meses', 'Em 3 meses'].map((label: string, index: number) => {
              const lastItem = chartData[chartData.length - 1];
              const projectedValue = lastItem.executado * Math.pow(1.05, index + 1);
              return `
              <tr>
                <td>${label}</td>
                <td>-</td>
                <td>${formatCurrency(projectedValue)}</td>
                <td>+${((Math.pow(1.05, index + 1) - 1) * 100).toFixed(1)}%</td>
              </tr>
              `;
            }).join('')}
          </table>
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
    }, 800);  // Increased timeout for better rendering
  } else {
    // If popup is blocked, offer download instead
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Dashboard_${data.municipio.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.info('Seu navegador bloqueou a janela de impressão. O arquivo foi baixado automaticamente.');
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

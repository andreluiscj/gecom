
import { PedidoCompra } from '@/types';
import { formatCurrency, formatDate } from './formatters';

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

// New function to export dashboard data as PDF
export const exportDashboardAsPDF = (data: any) => {
  // In a real app, we'd use jsPDF or another library to create a proper PDF
  // This is a simplified HTML-based approach
  const htmlContent = `
    <html>
    <head>
      <title>Dashboard - ${data.municipio}</title>
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
        .chart-placeholder { height: 300px; border: 1px dashed #ccc; display: flex; justify-content: center; align-items: center; margin: 20px 0; }
      </style>
    </head>
    <body>
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
      
      <div class="section">
        <h3>Gráficos de Análise</h3>
        <div class="chart-placeholder">
          Visualização de Gráficos Disponível no Dashboard Online
        </div>
      </div>
      
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
};

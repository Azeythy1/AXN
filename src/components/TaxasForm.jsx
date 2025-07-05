import React, { useState } from "react";

function TaxasForm({ taxas }) {
  // Estados
  const [valorLiquido, setValorLiquido] = useState("");
  const [tipoEntrada, setTipoEntrada] = useState("nenhuma");
  const [valorEntrada, setValorEntrada] = useState("");
  const [erro, setErro] = useState("");
  const [resultados, setResultados] = useState([]);
  const [mostrarTodasParcelas, setMostrarTodasParcelas] = useState(false);

  const arredondarParaMultiploDe10 = (valor) => {
    return Math.ceil(valor / 10) * 10;
  };

  const calcularTodasTaxas = () => {
    if (!valorLiquido) {
      setErro("Por favor, informe o valor líquido desejado.");
      return;
    }

    const valor = parseFloat(valorLiquido);
    if (isNaN(valor) || valor <= 0) {
      setErro("Por favor, insira um valor numérico válido.");
      return;
    }

    let valorComEntrada = valor;
    let entradaCalculo = 0;

    if (tipoEntrada !== "nenhuma" && valorEntrada) {
      const entrada = parseFloat(valorEntrada);
      if (!isNaN(entrada)) {
        entradaCalculo = entrada;
        valorComEntrada = valor - entrada;
        
        if (valorComEntrada <= 0) {
          setErro("O valor de entrada não pode ser maior ou igual ao valor líquido.");
          return;
        }
      }
    }

    const novosResultados = [];
    
    // Débito (1x)
    const valorRepassadoDebito = arredondarParaMultiploDe10(valorComEntrada / (1 - (taxas.debito / 100)));
    novosResultados.push({
      parcelas: 1,
      tipo: "Débito",
      valorParcela: valorRepassadoDebito.toFixed(2),
      valorTotal: valorRepassadoDebito.toFixed(2),
      valorLiquido: valor.toFixed(2),
      valorEntrada: entradaCalculo.toFixed(2)
    });

    // Crédito (1x)
    const valorRepassadoCredito1x = arredondarParaMultiploDe10(valorComEntrada / (1 - (taxas.credito[1] / 100)));
    novosResultados.push({
      parcelas: 1,
      tipo: "Crédito",
      valorParcela: valorRepassadoCredito1x.toFixed(2),
      valorTotal: valorRepassadoCredito1x.toFixed(2),
      valorLiquido: valor.toFixed(2),
      valorEntrada: entradaCalculo.toFixed(2)
    });



    // Crédito (2x a 18x)
    for (let parcelas = 2; parcelas <= 18; parcelas++) {
      const valorRepassado = arredondarParaMultiploDe10(valorComEntrada / (1 - (taxas.credito[parcelas] / 100)));
      novosResultados.push({
        parcelas,
        tipo: "Crédito",
        valorParcela: (valorRepassado / parcelas).toFixed(2),
        valorTotal: valorRepassado.toFixed(2),
        valorLiquido: valor.toFixed(2),
        valorEntrada: entradaCalculo.toFixed(2)
      });
    }

    setResultados(novosResultados);
    setErro("");
    setMostrarTodasParcelas(false);
  };

  const compartilharWhatsApp = (resultado) => {
    const mensagem = [
      `💳 *Resultado da Simulação*`,
      ``,
      `💰 *Valor Líquido:* R$ ${resultado.valorLiquido}`,
      resultado.valorEntrada > 0 ? `🤑 *Entrada:* R$ ${resultado.valorEntrada}\n` : '',
      `📊 *Forma:* ${resultado.tipo} ${resultado.parcelas}x`,
      `💸 *Valor Parcela:* R$ ${resultado.valorParcela}`,
      `🏷️ *Valor Total:* R$ ${resultado.valorTotal}`,
      `Orçamento válido até o dia ${new Date().toLocaleDateString('pt-BR')}`
    ].filter(Boolean).join('\n');
    
    window.open(`https://wa.me/?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  return (
    <div className="taxas-container">
      {/* Seção de inputs */}
      <div className="input-section">
        <div className="input-group">
          <label>Valor Líquido Desejado (R$):</label>
          <input
            type="number"
            value={valorLiquido}
            onChange={(e) => setValorLiquido(e.target.value)}
            placeholder="Valor que deseja receber"
            min="0"
          />
        </div>
        
        <div className="input-group">
          <label>Tipo de Entrada:</label>
          <select
            value={tipoEntrada}
            onChange={(e) => setTipoEntrada(e.target.value)}
          >
            <option value="nenhuma">Nenhuma entrada</option>
            <option value="pix">PIX</option>
            <option value="dinheiro">Dinheiro</option>
          </select>
        </div>
        
        {tipoEntrada !== "nenhuma" && (
          <div className="input-group">
            <label>Valor de Entrada (R$):</label>
            <input
              type="number"
              value={valorEntrada}
              onChange={(e) => setValorEntrada(e.target.value)}
              placeholder="Valor da entrada"
              min="0"
            />
          </div>
        )}
        
        <button onClick={calcularTodasTaxas} className="calculate-btn">
          Calcular
        </button>
      </div>
      
      {/* Mensagens de erro */}
      {erro && <div className="error-msg">{erro}</div>}
      
      {/* Resultados */}
      {resultados.length > 0 && (
        <div className="results-section">
          <h3>Opções de Pagamento</h3>
          
          <div className="results-grid">
            {/* Cabeçalho */}
            <div className="grid-header">
              <div>Parcelas</div>
              <div>Tipo</div>
              <div>Valor Parcela</div>
              <div>Valor Total</div>
              <div>Ação</div>
            </div>
            
            {/* Linhas de resultados */}
            {resultados
              .filter(r => mostrarTodasParcelas ? true : r.parcelas <= 12)
              .map((resultado, index) => (
                <div 
                  key={index} 
                  className={`grid-row ${resultado.parcelas === 1 && resultado.tipo === 'Débito' ? 'debito' : ''}`}
                >
                  <div>{resultado.parcelas}x</div>
                  <div>{resultado.tipo}</div>
                  <div>R$ {resultado.valorParcela}</div>
                  <div>R$ {resultado.valorTotal}</div>
                  <div>
                    <button 
                      onClick={() => compartilharWhatsApp(resultado)}
                      className="whatsapp-btn"
                    >
                      Compartilhar
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
          
          {/* Botão Ver Mais/Menos */}
          {resultados.length > 12 && (
            <button
              onClick={() => setMostrarTodasParcelas(!mostrarTodasParcelas)}
              className="toggle-btn"
            >
              {mostrarTodasParcelas ? '↑ Ver menos' : '↓ Ver mais (13x a 18x)'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default TaxasForm;
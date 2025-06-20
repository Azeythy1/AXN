import React, { useState } from "react";

function TaxasForm({ taxas }) {
  const [valorLiquido, setValorLiquido] = useState("");
  const [tipoEntrada, setTipoEntrada] = useState("nenhuma");
  const [valorEntrada, setValorEntrada] = useState("");
  const [erro, setErro] = useState("");
  const [resultados, setResultados] = useState([]);

  const arredondarParaMultiploDe10 = (valor) => {
    return Math.ceil(valor / 10) * 10;
  };

  const calcularTodasTaxas = () => {
    // Validações
    if (!valorLiquido) {
      setErro("Por favor, informe o valor líquido desejado.");
      return;
    }

    const valor = parseFloat(valorLiquido);
    if (isNaN(valor)) {
      setErro("Por favor, insira um valor numérico válido.");
      return;
    }

    // Tratamento da entrada
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

    // Calcular todas as opções de parcelamento
    const novosResultados = [];
    
    // Opção de débito (1x)
    const taxaDebito = taxas.debito / 100;
    const valorRepassadoDebito = valorComEntrada / (1 - taxaDebito);
    const valorRepassadoArredondadoDebito = arredondarParaMultiploDe10(valorRepassadoDebito);
    const taxaCobradaDebito = valorRepassadoArredondadoDebito * taxaDebito;
    
    novosResultados.push({
      parcelas: 1,
      tipo: "Débito",
      taxaPercentual: taxas.debito,
      valorParcela: valorRepassadoArredondadoDebito.toFixed(2),
      valorTotal: valorRepassadoArredondadoDebito.toFixed(2),
      taxaCobrada: taxaCobradaDebito.toFixed(2)
    });

    // Opções de crédito (2x a 18x)
    for (let parcelas = 2; parcelas <= 18; parcelas++) {
      const taxaCredito = taxas.credito[parcelas] / 100;
      const valorRepassadoCredito = valorComEntrada / (1 - taxaCredito);
      const valorRepassadoArredondadoCredito = arredondarParaMultiploDe10(valorRepassadoCredito);
      const taxaCobradaCredito = valorRepassadoArredondadoCredito * taxaCredito;
      const valorParcelaCredito = valorRepassadoArredondadoCredito / parcelas;
      
      novosResultados.push({
        parcelas,
        tipo: "Crédito",
        taxaPercentual: taxas.credito[parcelas],
        valorParcela: valorParcelaCredito.toFixed(2),
        valorTotal: valorRepassadoArredondadoCredito.toFixed(2),
        taxaCobrada: taxaCobradaCredito.toFixed(2)
      });
    }

    setResultados(novosResultados);
    setErro("");
  };

  return (
    <div className="taxas-form-container">
      <div className="input-group">
        <label className="input-label">Valor Líquido Desejado (R$):</label>
        <input
          type="number"
          value={valorLiquido}
          onChange={(e) => setValorLiquido(e.target.value)}
          className="input-field"
          placeholder="Digite o valor que deseja receber"
        />
      </div>
      
      <div className="input-group">
        <label className="input-label">Tipo de Entrada:</label>
        <select
          value={tipoEntrada}
          onChange={(e) => setTipoEntrada(e.target.value)}
          className="select-field"
        >
          <option value="nenhuma">Nenhuma entrada</option>
          <option value="pix">PIX</option>
          <option value="dinheiro">Dinheiro</option>
          <option value="troca">Troca</option>
          <option value="outro">Outro</option>
        </select>
      </div>
      
      {tipoEntrada !== "nenhuma" && (
        <div className="input-group">
          <label className="input-label">Valor de Entrada (R$):</label>
          <input
            type="number"
            value={valorEntrada}
            onChange={(e) => setValorEntrada(e.target.value)}
            className="input-field"
            placeholder="Digite o valor da entrada"
          />
        </div>
      )}
      
      <button onClick={calcularTodasTaxas} className="calculate-button">
        Calcular
      </button>
      
      {erro && <p className="error-message">{erro}</p>}
      
      {resultados.length > 0 && (
      <div className="result-container">
        <h3 className="result-title">Opções de Pagamento</h3>
        
        <div className="taxas-table">
          <div className="table-header">
            <div>Parcelas</div>
            <div>Tipo</div>
            <div>Taxa</div>
            <div>Valor Parcela</div>
            <div>Valor Total</div>
          </div>
          
          {resultados.map((resultado, index) => {
            const isSpecial = [6, 10, 12].includes(resultado.parcelas);
            return (
              <div 
                key={index} 
                className={`table-row ${isSpecial ? 'highlight-row' : ''}`}
                data-parcelas={resultado.parcelas}
              >
                <div>{resultado.parcelas}x</div>
                <div>{resultado.tipo}</div>
                {/* <div>{resultado.taxaPercentual}%</div> */}
                <div>R$ {resultado.valorParcela}</div>
                <div>R$ {resultado.valorTotal}</div>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </div>
)};
export default TaxasForm;
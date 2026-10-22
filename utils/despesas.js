
//monta a chave ex: 2026-10
export function criarChaveMes(mes, ano) {
  return `${ano}-${String(mes + 1).padStart(2, "0")}`;
}

//verifica se mostra ou não a despesa de acordo com o mês selecionado 
export function despesaPertenceAoMes(despesa, mes, ano) {
  const inicio = despesa.anoInicio * 12 + despesa.mesInicio;
  const atual = ano * 12 + mes;
  const diferenca = atual - inicio;

  if (diferenca < 0) {
    return false;
  }
  if (despesa.tipo === "unica") {
    return diferenca === 0;
  }
  if (despesa.tipo === "recorrente") {
    return true;
  }
  if (despesa.tipo === "parcelada") {
    return diferenca < Number(despesa.quantidadeParcelas);
  }
  return false;
}

//calcula qual parcela está sendo exibida
export function numeroDaParcela(despesa, mes, ano) {
  if (despesa.tipo !== "parcelada") {
    return null;
  }

  const inicio = despesa.anoInicio * 12 + despesa.mesInicio;
  const atual = ano * 12 + mes;

  return atual - inicio + 1;
}

//calcula o valor correto, considerando o histórico de despesas recorrentes e os valores das parcelas
export function valorDaParcela(despesa, chaveMes) {
  if (despesa.tipo === "recorrente") {
    const valorHistorico = despesa.historicoValores?.[chaveMes];
    return Number(valorHistorico ?? despesa.valor);
  }
  if (despesa.tipo !== "parcelada") {
    return Number(despesa.valor);
  }
  if (despesa.parcelas) {
    const parcela = despesa.parcelas.find(
      (item) => item.mes === chaveMes
    );
    return parcela ? Number(parcela.valor) : 0;
  }
  return (
    Number(despesa.valor) /
    Number(despesa.quantidadeParcelas)
  );
}

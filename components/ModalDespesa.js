import { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, TouchableWithoutFeedback, TextInput, Alert } from "react-native";

export default function ModalDespesa({ fecharModal, adicionarDespesa, despesaParaEditar, mesInicio, anoInicio, mesSelecionado }) {
  const [nome, setNome] = useState("")
  const [valor, setValor] = useState("");
  const [diaVencimento, setDiaVencimento] = useState("");
  const [tipo, setTipo] = useState("unica");
  const [quantidadeParcelas, setQuantidadeParcelas] = useState("");

  useEffect(() => {
    if (despesaParaEditar) {
      if (despesaParaEditar.modoEdicao === "parcela") {
        const parcela = despesaParaEditar.parcelas?.find(
          (item) => item.mes === mesSelecionado
        );

        setValor(String(parcela?.valor ?? despesaParaEditar.valor));
      } else {
        setValor(String(despesaParaEditar.valor));
      }

      setNome(despesaParaEditar.nome);
      setDiaVencimento(String(despesaParaEditar.diaVencimento));
      setTipo(despesaParaEditar.tipo);
      setQuantidadeParcelas(
        String(despesaParaEditar.quantidadeParcelas || "")
      );
    }
  }, [despesaParaEditar, mesSelecionado]);

  const gerarParcelas = () => {
    const quantidade = Number(quantidadeParcelas);
    const valorTotal = Number(valor.replace(",", "."));

    if (quantidade <= 0 || !Number.isFinite(valorTotal)) {
      return [];
    }

    const valorParcela = valorTotal / quantidade;
    const listaParcelas = [];

    // Ao editar a compra inteira, usamos o mês original
    // para gerar a sequência completa de parcelas.
    const inicioMes = despesaParaEditar
      ? despesaParaEditar.mesInicio
      : mesInicio;

    const inicioAno = despesaParaEditar
      ? despesaParaEditar.anoInicio
      : anoInicio;

    for (let i = 0; i < quantidade; i++) {
      const data = new Date(inicioAno, inicioMes + i, 1);
      const anoParcela = data.getFullYear();
      const mesParcela = String(data.getMonth() + 1).padStart(2, "0");

      listaParcelas.push({
        mes: `${anoParcela}-${mesParcela}`,
        numero: i + 1,
        valor: valorParcela,
      });
    }

    return listaParcelas;
  };


  const adicionar = ()=> {
    if(nome.trim() === ""){
      alert("Digite o nome da despesa")
      return
    }
    if(valor.trim() === ""){
      alert("Digite o valor da despesa")
      return
    }
    if(diaVencimento.trim() === ""){
      alert("Digite o dia de vencimento")
      return
    }

  if (tipo === "parcelada") {
    const quantidade = Number(quantidadeParcelas);

    if (
      quantidadeParcelas.trim() === "" ||
      !Number.isInteger(quantidade) ||
      quantidade <= 0
    ) {
      alert("Digite uma quantidade de parcelas válida");
      return;
    }

    if (
      despesaParaEditar?.modoEdicao === "compra" &&
      despesaParaEditar.tipo === "parcelada"
    ) {
      const dataInicio = new Date(
        despesaParaEditar.anoInicio,
        despesaParaEditar.mesInicio,
        1
      );

      const dataSelecionada = new Date(
        Number(mesSelecionado.slice(0, 4)),
        Number(mesSelecionado.slice(5, 7)) - 1,
        1
      );

      const parcelasAnteriores =
        (dataSelecionada.getFullYear() - dataInicio.getFullYear()) * 12 +
        dataSelecionada.getMonth() -
        dataInicio.getMonth();

      if (quantidade <= parcelasAnteriores) {
        alert(
          "A quantidade total precisa ser maior que o número de parcelas anteriores ao mês selecionado."
        );
        return;
      }
    }
  }
    const modoEdicao = despesaParaEditar?.modoEdicao

    const dados = {
      id: despesaParaEditar ? despesaParaEditar.id : Date.now(),
      mesInicio: despesaParaEditar ? despesaParaEditar.mesInicio : mesInicio,
      anoInicio: despesaParaEditar ? despesaParaEditar.anoInicio : anoInicio,
      nome,
      valor:
        modoEdicao === 'parcela' ? despesaParaEditar.valor : valor,
      diaVencimento,
      tipo,
      quantidadeParcelas,
      modoEdicao,
      mesSelecionado,
      valorParcelaEditada:
        modoEdicao === 'parcela' ? Number(valor.replace(",", ".")) : undefined,
      parcelas: tipo === 'parcelada' && modoEdicao !== 'parcela' ? gerarParcelas() : despesaParaEditar?.parcelas || [], 
    }

    const nomeTipo = tipo === 'unica' ? "Única" : tipo === 'recorrente' ? 'Recorrente' : 'Parcelada'

    console.log(dados);

    Alert.alert(
      "Confirmar cadastro?",
      `
      Despesa: ${nome}
      Valor: R$ ${valor}
      Dia do vencimento: ${diaVencimento}
      Tipo: ${nomeTipo}${tipo === "parcelada"? ` em ${quantidadeParcelas}x` : "" }`,
      [
        {text: "Cancelar", style: "cancel"},
        {text: "Confirmar",
          onPress: () => {
            adicionarDespesa(dados);

            //limpando os campos e fechando o modal após cadastrar
            setNome("");
            setValor("");
            setDiaVencimento("");
            setTipo("unica");
            setQuantidadeParcelas("");

            fecharModal();
          },
        },
      ]
    );

  }

  return (
    <TouchableWithoutFeedback onPress={fecharModal}>
      <View style={styles.container}>

        <TouchableWithoutFeedback>
          <View style={styles.conteudo}>

            <Text style={styles.titulo}>Nova despesa</Text>

            <Text style={styles.label}>Despesa</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Mercado"
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.label}>Valor</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 150,00"
              value={valor}
              onChangeText={setValor}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Dia do vencimento</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 10"
              value={diaVencimento}
              onChangeText={setDiaVencimento}
              keyboardType="numeric"
              maxLength={2}
            />

            <Text style={styles.label}>Tipo da despesa</Text>

            <View style={styles.opcoesTipo}>
              <Pressable style={styles.opcaoTipo} onPress={()=> setTipo("unica")}>
                <View style={tipo === "unica" ? styles.radioSelecionado : styles.radio}/>

                <Text>Única</Text>
              </Pressable>

              <Pressable style={styles.opcaoTipo} onPress={()=>setTipo('recorrente')}>
                <View style={tipo === "recorrente" ? styles.radioSelecionado : styles.radio} />

                <Text>Recorrente</Text>
              </Pressable>

               <Pressable style={styles.opcaoTipo} onPress={()=> setTipo("parcelada")}>
                <View style={tipo === "parcelada" ? styles.radioSelecionado : styles.radio}/>

                <Text>Parcelada</Text>
              </Pressable>
            </View>

            {tipo === "parcelada" &&( //se o tipo for 'parcelada' temos um novo input para a quantidade 
              <>
                <Text style={styles.label}>Quantidade de parcelas</Text>
                 <TextInput
                  style={styles.input}
                  placeholder="Ex: 5"
                  value={quantidadeParcelas}
                  onChangeText={setQuantidadeParcelas}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </>
            )}

            <View style={styles.botoes}>
              <Pressable style={styles.botaoCancelar} onPress={fecharModal}>
                <Text>Cancelar</Text>
              </Pressable>

              <Pressable style={styles.botaoAdicionar} onPress={adicionar}>
                <Text style={styles.textoBotaoAdicionar}>Adicionar</Text>
              </Pressable>
            </View>

          </View>
        </TouchableWithoutFeedback>

      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  conteudo: {
    backgroundColor: "#fff",
    width: "90%",
    padding: 20,
    borderRadius: 15,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f7f9fc",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  opcoesTipo: {
  marginBottom: 20,
  },
  opcaoTipo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#999",
    marginRight: 10,
  },
  radioSelecionado: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 6,
    borderColor: "#222",
    marginRight: 10,
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  botaoCancelar: {
    padding: 12,
  },
  botaoAdicionar: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 10,
  },
  textoBotaoAdicionar: {
    color: "#fff",
    fontWeight: "600",
  },
});